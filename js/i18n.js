import { L } from "./util.js";

// Extra labels not tied to a single {en,ar} entry in content.js's `ui` dict
// (pros/cons/limits/alts headings used inside tradeoff blocks).
const EXTRA = {
  pros: { en: "Pros", ar: "الإيجابيات" },
  cons: { en: "Cons", ar: "السلبيات" },
  limits: { en: "Limitations", ar: "الحدود" },
  alts: { en: "Alternatives", ar: "البدائل" }
};

// Builds the flat "T" dictionary the view renderers read from: every ui.*
// entry resolved to the current language, plus the couple of derived labels.
export function buildT(state, content) {
  const T = {};
  Object.keys(content.ui).forEach((k) => { T[k] = L(state, content.ui[k]); });
  Object.keys(EXTRA).forEach((k) => { T[k] = L(state, EXTRA[k]); });
  T.theme_label = state.theme === "dark" ? T.theme_dark : T.theme_light;
  return T;
}
