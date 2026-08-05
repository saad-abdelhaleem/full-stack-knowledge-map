// HTML-escaping helper. Every render/*.js module builds markup via template
// literals (no framework to auto-escape text nodes), so any content-derived
// string — titles, lesson prose, code samples — must be passed through esc()
// before it lands in an innerHTML string. Code blocks in particular contain
// raw "<" and "&" (generics like Task<Order>) that would otherwise be parsed
// as markup.
export function esc(value) {
  if (value == null) return "";
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function L(state, obj) {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  const lang = state.lang;
  return obj[lang] != null ? obj[lang] : obj.en;
}
