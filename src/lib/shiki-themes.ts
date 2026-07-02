import type { ThemeRegistration } from "shiki";

/**
 * Custom dark theme matching tonycrane.cc's MkDocs Material code colors
 * Background: #1d1d1d, warm colorful tokens
 */
export const tonycraneDark: ThemeRegistration = {
  name: "tonycrane-dark",
  type: "dark",
  colors: {
    "editor.background": "#1d1d1d",
    "editor.foreground": "#d8d8d8",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#888888", fontStyle: "italic" },
    },
    {
      scope: ["string", "string.quoted", "string.interpolated", "string.regexp", "string.template"],
      settings: { foreground: "#2fb170" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character", "constant.other"],
      settings: { foreground: "#e6695b" },
    },
    {
      scope: ["keyword", "keyword.control", "keyword.operator", "keyword.other", "storage.type", "storage.modifier"],
      settings: { foreground: "#6791e0" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#c973d9" },
    },
    {
      scope: ["entity.name.class", "entity.name.type", "support.type", "support.class", "entity.name.namespace"],
      settings: { foreground: "#9383e2" },
    },
    {
      scope: ["variable", "variable.other", "meta.definition.variable", "support.variable"],
      settings: { foreground: "#d8d8d8" },
    },
    {
      scope: ["variable.parameter", "variable.language"],
      settings: { foreground: "#e6695b" },
    },
    {
      scope: ["entity.name.tag", "meta.tag"],
      settings: { foreground: "#6791e0" },
    },
    {
      scope: ["entity.other.attribute-name", "meta.attribute"],
      settings: { foreground: "#c973d9" },
    },
    {
      scope: ["markup.heading", "markup.heading.marker"],
      settings: { foreground: "#6791e0" },
    },
    {
      scope: ["markup.bold"],
      settings: { foreground: "#c973d9", fontStyle: "bold" },
    },
    {
      scope: ["markup.italic"],
      settings: { foreground: "#9383e2", fontStyle: "italic" },
    },
    {
      scope: ["markup.inserted"],
      settings: { foreground: "#2fb170" },
    },
    {
      scope: ["markup.deleted"],
      settings: { foreground: "#e6695b" },
    },
    {
      scope: ["string.escape", "constant.character.escape"],
      settings: { foreground: "#f06090" },
    },
    {
      scope: ["punctuation", "meta.brace", "punctuation.definition"],
      settings: { foreground: "#b0b0b0" },
    },
    {
      scope: ["punctuation.separator", "punctuation.accessor"],
      settings: { foreground: "#888888" },
    },
    {
      scope: ["meta.import", "meta.export"],
      settings: { foreground: "#6791e0" },
    },
    {
      scope: ["entity.name.function.support", "support.constant"],
      settings: { foreground: "#9383e2" },
    },
    {
      scope: ["meta.property-name", "support.type.property-name"],
      settings: { foreground: "#e6695b" },
    },
    {
      scope: ["meta.property-value", "meta.value"],
      settings: { foreground: "#2fb170" },
    },
  ],
};

/**
 * Custom light theme matching tonycrane.cc's light mode code colors
 * Background: #fafafa, softer version of the dark palette
 */
export const tonycraneLight: ThemeRegistration = {
  name: "tonycrane-light",
  type: "light",
  colors: {
    "editor.background": "#fafafa",
    "editor.foreground": "#364548",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#999999", fontStyle: "italic" },
    },
    {
      scope: ["string", "string.quoted", "string.interpolated", "string.regexp", "string.template"],
      settings: { foreground: "#1b8a4f" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character", "constant.other"],
      settings: { foreground: "#c5422f" },
    },
    {
      scope: ["keyword", "keyword.control", "keyword.operator", "keyword.other", "storage.type", "storage.modifier"],
      settings: { foreground: "#476cd6" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#a3369f" },
    },
    {
      scope: ["entity.name.class", "entity.name.type", "support.type", "support.class", "entity.name.namespace"],
      settings: { foreground: "#7c6ad8" },
    },
    {
      scope: ["variable", "variable.other", "meta.definition.variable", "support.variable"],
      settings: { foreground: "#364548" },
    },
    {
      scope: ["variable.parameter", "variable.language"],
      settings: { foreground: "#c5422f" },
    },
    {
      scope: ["entity.name.tag", "meta.tag"],
      settings: { foreground: "#476cd6" },
    },
    {
      scope: ["entity.other.attribute-name", "meta.attribute"],
      settings: { foreground: "#a3369f" },
    },
    {
      scope: ["markup.heading", "markup.heading.marker"],
      settings: { foreground: "#476cd6" },
    },
    {
      scope: ["markup.bold"],
      settings: { foreground: "#a3369f", fontStyle: "bold" },
    },
    {
      scope: ["markup.italic"],
      settings: { foreground: "#7c6ad8", fontStyle: "italic" },
    },
    {
      scope: ["markup.inserted"],
      settings: { foreground: "#1b8a4f" },
    },
    {
      scope: ["markup.deleted"],
      settings: { foreground: "#c5422f" },
    },
    {
      scope: ["string.escape", "constant.character.escape"],
      settings: { foreground: "#d63d6d" },
    },
    {
      scope: ["punctuation", "meta.brace", "punctuation.definition"],
      settings: { foreground: "#808080" },
    },
    {
      scope: ["punctuation.separator", "punctuation.accessor"],
      settings: { foreground: "#999999" },
    },
    {
      scope: ["meta.import", "meta.export"],
      settings: { foreground: "#476cd6" },
    },
    {
      scope: ["entity.name.function.support", "support.constant"],
      settings: { foreground: "#7c6ad8" },
    },
    {
      scope: ["meta.property-name", "support.type.property-name"],
      settings: { foreground: "#c5422f" },
    },
    {
      scope: ["meta.property-value", "meta.value"],
      settings: { foreground: "#1b8a4f" },
    },
  ],
};
