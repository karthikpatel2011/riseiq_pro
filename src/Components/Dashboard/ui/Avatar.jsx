export default function Avatar({ src, name, size = 32 }) {
  const initial = (name || "?")[0]?.toUpperCase();
  const fontSize = size < 24 ? 10 : size < 36 ? 12 : 14;

  if (src && typeof src === "string" && src.startsWith("http")) {
    return (
      <img
        src={src}
        alt={name || "avatar"}
        className="db-avatar-img"
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
    );
  }

  return (
    <div
      className="db-avatar-fallback"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #7C3AED, #5B43E6)",
        color: "#fff",
        fontSize,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}
