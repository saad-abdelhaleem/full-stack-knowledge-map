import { ui, SECTION_TITLES, lessonDetail, modules } from "./content.js";

// Single aggregate the rest of the app imports from, so call sites read
// `content.modules` / `content.ui` / etc. instead of juggling four imports.
export const content = { ui, SECTION_TITLES, lessonDetail, modules };
