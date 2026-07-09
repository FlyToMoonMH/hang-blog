import fs from "fs";
import path from "path";

type FeishuApiResponse<T> = {
  code?: number;
  msg?: string;
  data?: T;
  tenant_access_token?: string;
};

type WikiNode = {
  title?: string;
  obj_token?: string;
  obj_type?: string;
  node_token?: string;
  token?: string;
};

type SyncOptions = {
  urlOrToken: string;
  outDir: string;
  section: string;
  category: string;
  tags: string[];
  title?: string;
  dryRun: boolean;
};

type DocxTextStyle = {
  bold?: boolean;
  inline_code?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
};

type DocxTextElement = {
  text_run?: {
    content?: string;
    text_element_style?: DocxTextStyle;
  };
};

type DocxTextContent = {
  elements?: DocxTextElement[];
  style?: {
    sequence?: string;
  };
};

type DocxImage = {
  token?: string;
  caption?: {
    content?: string;
  };
};

type DocxBlock = {
  block_id: string;
  block_type: number;
  children?: string[];
  text?: DocxTextContent;
  bullet?: DocxTextContent;
  ordered?: DocxTextContent;
  image?: DocxImage;
  [key: string]: unknown;
};

type DocxBlocksResponse = {
  has_more?: boolean;
  page_token?: string;
  items?: DocxBlock[];
};

const projectRoot = process.cwd();
const defaultOutDir = path.join(projectRoot, "content", "posts", "Feishu");

loadEnvFile(path.join(projectRoot, ".env.local"));

const feishuBaseUrl = process.env.FEISHU_BASE_URL ?? "https://open.feishu.cn";

main().catch((error) => {
  console.error(`❌ 飞书同步失败: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("请先在 .env.local 中配置 FEISHU_APP_ID 和 FEISHU_APP_SECRET");
  }

  const parsed = parseFeishuUrlOrToken(options.urlOrToken);
  const accessToken = await getTenantAccessToken(appId, appSecret);
  const source = parsed.kind === "wiki"
    ? await resolveWikiNode(accessToken, parsed.token)
    : {
        title: options.title,
        objToken: parsed.token,
        objType: parsed.kind,
        nodeToken: parsed.token,
      };

  if (!source.objToken || !source.objType) {
    throw new Error("没有从飞书链接中解析到可读取的文档 token");
  }

  const title = options.title ?? source.title ?? "飞书文档";
  const fileName = `${slugifyFileName(title)}.md`;
  const outputPath = path.join(options.outDir, fileName);
  const markdown = await getDocumentMarkdown({
    accessToken,
    objToken: source.objToken,
    objType: source.objType,
    title,
    outputPath,
    dryRun: options.dryRun,
  });
  const today = new Date().toISOString().slice(0, 10);
  const body = buildMarkdownFile({
    title,
    date: today,
    section: options.section,
    category: options.category,
    tags: options.tags,
    sourceUrl: options.urlOrToken,
    markdown,
  });

  if (options.dryRun) {
    console.log(body);
    return;
  }

  fs.mkdirSync(options.outDir, { recursive: true });
  fs.writeFileSync(outputPath, body, "utf-8");
  console.log(`✅ 已同步飞书文档: ${path.relative(projectRoot, outputPath)}`);
}

function parseArgs(args: string[]): SyncOptions {
  const options: SyncOptions = {
    urlOrToken: process.env.FEISHU_WIKI_URL ?? "",
    outDir: defaultOutDir,
    section: "Feishu",
    category: "Feishu",
    tags: ["feishu"],
    dryRun: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if ((arg === "--url" || arg === "--token") && next) {
      options.urlOrToken = next;
      index += 1;
      continue;
    }

    if (arg === "--out-dir" && next) {
      options.outDir = path.resolve(projectRoot, next);
      index += 1;
      continue;
    }

    if (arg === "--section" && next) {
      options.section = next;
      index += 1;
      continue;
    }

    if (arg === "--category" && next) {
      options.category = next;
      index += 1;
      continue;
    }

    if (arg === "--tags" && next) {
      options.tags = next.split(",").map((tag) => tag.trim()).filter(Boolean);
      index += 1;
      continue;
    }

    if (arg === "--title" && next) {
      options.title = next;
      index += 1;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (!arg.startsWith("-") && !options.urlOrToken) {
      options.urlOrToken = arg;
    }
  }

  if (!options.urlOrToken) {
    throw new Error("请传入飞书 Wiki URL，例如: npm run sync:feishu -- --url https://my.feishu.cn/wiki/...");
  }

  return options;
}

function parseFeishuUrlOrToken(value: string): { kind: string; token: string } {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    const wikiIndex = segments.indexOf("wiki");
    const docxIndex = segments.indexOf("docx");
    const docsIndex = segments.indexOf("docs");

    if (wikiIndex >= 0 && segments[wikiIndex + 1]) {
      return { kind: "wiki", token: segments[wikiIndex + 1] };
    }

    if (docxIndex >= 0 && segments[docxIndex + 1]) {
      return { kind: "docx", token: segments[docxIndex + 1] };
    }

    if (docsIndex >= 0 && segments[docsIndex + 1]) {
      return { kind: "doc", token: segments[docsIndex + 1] };
    }
  } catch {
    // Plain token.
  }

  return { kind: "wiki", token: value.trim() };
}

async function getTenantAccessToken(appId: string, appSecret: string): Promise<string> {
  const response = await postFeishu<{ tenant_access_token?: string }>("/open-apis/auth/v3/tenant_access_token/internal", {
    app_id: appId,
    app_secret: appSecret,
  });
  const token = response.tenant_access_token;

  if (!token) {
    throw new Error("飞书没有返回 tenant_access_token");
  }

  return token;
}

async function resolveWikiNode(accessToken: string, nodeToken: string) {
  const params = new URLSearchParams({ token: nodeToken });
  const data = await getFeishu<{ node?: WikiNode; obj_token?: string; obj_type?: string; title?: string }>(
    `/open-apis/wiki/v2/spaces/get_node?${params.toString()}`,
    accessToken
  );
  const node: WikiNode = data.node ?? data;

  return {
    title: node.title,
    objToken: node.obj_token,
    objType: node.obj_type,
    nodeToken: node.node_token ?? node.token ?? nodeToken,
  };
}

async function getDocumentMarkdown(input: {
  accessToken: string;
  objToken: string;
  objType: string;
  title: string;
  outputPath: string;
  dryRun: boolean;
}): Promise<string> {
  const { accessToken, objToken, objType } = input;

  if (objType === "docx") {
    const blocks = await listDocxBlocks(accessToken, objToken);
    const markdown = await renderDocxBlocksToMarkdown({
      accessToken,
      blocks,
      title: input.title,
      outputPath: input.outputPath,
      dryRun: input.dryRun,
    });

    if (markdown.trim()) {
      return markdown;
    }
  }

  const docContentParams = new URLSearchParams({
    doc_token: objToken,
    doc_type: normalizeDocType(objType),
    content_type: "markdown",
  });

  try {
    const data = await getFeishu<Record<string, unknown>>(
      `/open-apis/docs/v1/content?${docContentParams.toString()}`,
      accessToken
    );
    const markdown = pickMarkdownContent(data);

    if (markdown) {
      return markdown;
    }
  } catch (error) {
    if (objType !== "docx") {
      throw error;
    }
  }

  if (objType === "docx") {
    const data = await getFeishu<Record<string, unknown>>(
      `/open-apis/docx/v1/documents/${encodeURIComponent(objToken)}/raw_content`,
      accessToken
    );
    const markdown = pickMarkdownContent(data);

    if (markdown) {
      return markdown;
    }
  }

  throw new Error(`飞书没有返回可用的 Markdown 内容，文档类型: ${objType}`);
}

async function listDocxBlocks(accessToken: string, documentId: string): Promise<DocxBlock[]> {
  const blocks: DocxBlock[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      page_size: "500",
      document_revision_id: "-1",
    });

    if (pageToken) {
      params.set("page_token", pageToken);
    }

    const data = await getFeishu<DocxBlocksResponse>(
      `/open-apis/docx/v1/documents/${encodeURIComponent(documentId)}/blocks?${params.toString()}`,
      accessToken
    );

    blocks.push(...(data.items ?? []));
    pageToken = data.has_more ? data.page_token : undefined;
  } while (pageToken);

  return blocks;
}

async function renderDocxBlocksToMarkdown(input: {
  accessToken: string;
  blocks: DocxBlock[];
  title: string;
  outputPath: string;
  dryRun: boolean;
}): Promise<string> {
  const blockMap = new Map(input.blocks.map((block) => [block.block_id, block]));
  const root = input.blocks.find((block) => block.block_type === 1) ?? input.blocks[0];
  const imageFilePrefix = slugifyFileName(input.title);
  const imagesDir = path.join(path.dirname(input.outputPath), "images");
  const imageState = { index: 0 };

  if (!input.dryRun) {
    fs.mkdirSync(imagesDir, { recursive: true });
    removePreviousImages(imagesDir, imageFilePrefix);
  }

  const lines = [`# ${input.title}`];

  for (const childId of root?.children ?? []) {
    const rendered = await renderDocxBlock({
      accessToken: input.accessToken,
      block: blockMap.get(childId),
      blockMap,
      imagesDir,
      imageFilePrefix,
      imageState,
      dryRun: input.dryRun,
    });

    if (rendered) {
      lines.push(rendered);
    }
  }

  return lines.join("\n\n");
}

async function renderDocxBlock(input: {
  accessToken: string;
  block?: DocxBlock;
  blockMap: Map<string, DocxBlock>;
  imagesDir: string;
  imageFilePrefix: string;
  imageState: { index: number };
  dryRun: boolean;
}): Promise<string> {
  const { block } = input;

  if (!block) return "";

  let ownMarkdown = "";
  const heading = getHeadingContent(block);

  if (heading) {
    const level = Math.max(1, Math.min(6, heading.level));
    ownMarkdown = `${"#".repeat(level)} ${renderTextElements(heading.content.elements ?? [])}`.trim();
  } else if (block.text) {
    ownMarkdown = renderTextElements(block.text.elements ?? []);
  } else if (block.bullet) {
    ownMarkdown = `- ${renderTextElements(block.bullet.elements ?? [])}`.trim();
  } else if (block.ordered) {
    const sequence = block.ordered.style?.sequence ?? "1";
    ownMarkdown = `${sequence}. ${renderTextElements(block.ordered.elements ?? [])}`.trim();
  } else if (block.image?.token) {
    const caption = block.image.caption?.content?.trim() ?? "";
    const imagePath = await downloadFeishuImage({
      accessToken: input.accessToken,
      token: block.image.token,
      imagesDir: input.imagesDir,
      imageFilePrefix: input.imageFilePrefix,
      imageState: input.imageState,
      dryRun: input.dryRun,
    });

    ownMarkdown = `![${escapeMarkdownAlt(caption)}](${imagePath})`;
  }

  const parts = ownMarkdown ? [ownMarkdown] : [];

  if (block.children?.length) {
    const childMarkdown: string[] = [];

    for (const childId of block.children) {
      const rendered = await renderDocxBlock({
        ...input,
        block: input.blockMap.get(childId),
      });

      if (rendered) {
        childMarkdown.push(block.block_type === 34 ? quoteMarkdown(rendered) : rendered);
      }
    }

    const children = childMarkdown.join("\n\n");

    if (children) {
      parts.push(children);
    }
  }

  return parts.join("\n\n");
}

function getHeadingContent(block: DocxBlock): { level: number; content: DocxTextContent } | null {
  for (let level = 1; level <= 9; level += 1) {
    const key = `heading${level}`;
    const content = block[key];

    if (content && typeof content === "object") {
      return { level, content: content as DocxTextContent };
    }
  }

  return null;
}

function renderTextElements(elements: DocxTextElement[]): string {
  return elements.map((element) => {
    const textRun = element.text_run;

    if (!textRun?.content) {
      return "";
    }

    return applyMarkdownStyle(textRun.content, textRun.text_element_style ?? {});
  }).join("");
}

function applyMarkdownStyle(content: string, style: DocxTextStyle): string {
  let result = content;

  if (style.inline_code) {
    result = `\`${result.replace(/`/g, "\\`")}\``;
  }

  if (style.bold) {
    result = `**${result}**`;
  }

  if (style.italic) {
    result = `*${result}*`;
  }

  if (style.strikethrough) {
    result = `~~${result}~~`;
  }

  return result;
}

async function downloadFeishuImage(input: {
  accessToken: string;
  token: string;
  imagesDir: string;
  imageFilePrefix: string;
  imageState: { index: number };
  dryRun: boolean;
}): Promise<string> {
  input.imageState.index += 1;
  const imageNumber = String(input.imageState.index).padStart(3, "0");

  if (input.dryRun) {
    return `images/${input.imageFilePrefix}-${imageNumber}.png`;
  }

  const response = await fetch(
    `${feishuBaseUrl}/open-apis/drive/v1/medias/${encodeURIComponent(input.token)}/download`,
    {
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`下载飞书图片失败: ${response.status} ${message}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const extension = imageExtensionFromContentType(contentType);
  const fileName = `${input.imageFilePrefix}-${imageNumber}${extension}`;
  const filePath = path.join(input.imagesDir, fileName);
  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  return `images/${fileName}`;
}

function imageExtensionFromContentType(contentType: string): string {
  if (contentType.includes("image/jpeg")) return ".jpg";
  if (contentType.includes("image/webp")) return ".webp";
  if (contentType.includes("image/gif")) return ".gif";
  if (contentType.includes("image/svg")) return ".svg";
  return ".png";
}

function removePreviousImages(imagesDir: string, imageFilePrefix: string) {
  if (!fs.existsSync(imagesDir)) return;

  for (const fileName of fs.readdirSync(imagesDir)) {
    if (fileName.startsWith(`${imageFilePrefix}-`)) {
      fs.rmSync(path.join(imagesDir, fileName), { force: true });
    }
  }
}

function escapeMarkdownAlt(value: string): string {
  return value.replace(/[\[\]]/g, "");
}

function quoteMarkdown(value: string): string {
  return value.split("\n").map((line) => `> ${line}`).join("\n");
}

function normalizeDocType(objType: string): string {
  if (objType === "docx" || objType === "doc") return objType;
  return objType;
}

function pickMarkdownContent(data: Record<string, unknown>): string | null {
  const candidates = [
    data.content,
    data.markdown,
    data.raw_content,
    data.text,
    data.document,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }

    if (candidate && typeof candidate === "object") {
      const nested = pickMarkdownContent(candidate as Record<string, unknown>);

      if (nested) {
        return nested;
      }
    }
  }

  return null;
}

async function getFeishu<T>(pathName: string, accessToken: string): Promise<T> {
  const response = await fetch(`${feishuBaseUrl}${pathName}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return readFeishuResponse<T>(response);
}

async function postFeishu<T>(pathName: string, payload: unknown): Promise<T> {
  const response = await fetch(`${feishuBaseUrl}${pathName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  return readFeishuResponse<T>(response);
}

async function readFeishuResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const json = text ? (JSON.parse(text) as FeishuApiResponse<T>) : {};

  if (!response.ok || (typeof json.code === "number" && json.code !== 0)) {
    throw new Error(`飞书 API 错误: ${json.code ?? response.status} ${json.msg ?? text}`);
  }

  return (json.data ?? json) as T;
}

function buildMarkdownFile(input: {
  title: string;
  date: string;
  section: string;
  category: string;
  tags: string[];
  sourceUrl: string;
  markdown: string;
}) {
  const description = `${input.title} 的飞书同步笔记`;
  const frontmatter = [
    "---",
    `title: ${quoteYaml(input.title)}`,
    `description: ${quoteYaml(description)}`,
    `summary: ${quoteYaml(description)}`,
    `date: ${quoteYaml(input.date)}`,
    `updated: ${quoteYaml(input.date)}`,
    `category: ${quoteYaml(input.category)}`,
    `section: ${quoteYaml(input.section)}`,
    `nav_title: ${quoteYaml(input.title)}`,
    `tags: [${input.tags.map(quoteYaml).join(", ")}]`,
    "draft: false",
    `source: ${quoteYaml(input.sourceUrl)}`,
    "---",
    "",
  ].join("\n");

  return `${frontmatter}${input.markdown.trim()}\n`;
}

function quoteYaml(value: string): string {
  return JSON.stringify(value);
}

function slugifyFileName(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "feishu-doc";
}

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf-8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex < 0) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    if (process.env[key]) continue;

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}
