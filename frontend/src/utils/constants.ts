/**
 * Application layout tokens.
 * Mirror the CSS custom properties defined in theme.css.
 */

export const HEADER_HEIGHT = 64
export const SIDEBAR_WIDTH = 260
export const SIDEBAR_WIDTH_COLLAPSED = 72
export const SIDEBAR_GUTTER = 20
export const INSPECTOR_WIDTH = 316
export const INSPECTOR_GUTTER = 16
export const CONTENT_PADDING = 16
export const PAGE_MAX_WIDTH = 1100

/** Computed offsets used for main content left/right padding. */
export const MAIN_LEFT_EXPANDED = SIDEBAR_WIDTH + SIDEBAR_GUTTER // 280
export const MAIN_LEFT_COLLAPSED = SIDEBAR_WIDTH_COLLAPSED + SIDEBAR_GUTTER // 92
export const MAIN_RIGHT_RESERVED = INSPECTOR_WIDTH + INSPECTOR_GUTTER // 332
