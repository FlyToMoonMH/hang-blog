interface NoteImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  align?: "center" | "left" | "right";
  caption?: string;
}

export function NoteImage({ src, alt = "", width, align = "center", caption }: NoteImageProps) {
  const wrapperClass =
    align === "left"
      ? "note-img-left"
      : align === "right"
        ? "note-img-right"
        : "note-img-center";

  const imgStyle: React.CSSProperties = {};
  if (width !== undefined && width !== null) {
    const w = String(width);
    if (w.endsWith("%") || w.endsWith("px") || w.endsWith("rem") || w.endsWith("vw")) {
      imgStyle.width = w;
    } else {
      imgStyle.width = `${w}px`;
    }
  }

  return (
    <div className={wrapperClass}>
      <figure style={{ margin: 0, display: "inline-block" }}>
        <img src={src} alt={alt} style={imgStyle} />
        {caption && <figcaption className="note-figcaption">{caption}</figcaption>}
      </figure>
    </div>
  );
}
