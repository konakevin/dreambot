/**
 * Single source of truth for the post-thumbnail grid layout used by:
 * - components/PostGrid.tsx (profile / saved / dreams / user-public grids)
 * - components/PostTile.tsx (individual cell — sparkle perimeter math + styles)
 * - app/(tabs)/top.tsx (search browse grid + search-results triplet rows)
 *
 * Before this module these constants were duplicated in three places, which
 * meant any column-count or aspect-ratio change had to be made — perfectly —
 * in three files at once. Now they all import from here.
 *
 * Layout: 3-column portrait grid (Instagram/TikTok-style). Tiles render at
 * the source dream's native aspect ratio (1024×1664 = 1:1.625) so no image
 * content is cropped from the thumbnail.
 */

import { Dimensions } from 'react-native';

export const NUM_COLUMNS = 3;
export const TILE_GAP = 2;

/** height / width of a generated dream image (1024×1664 portrait) */
export const PORTRAIT_RATIO = 1664 / 1024;

const SCREEN_WIDTH = Dimensions.get('window').width;

/** Width of a single thumbnail. Edge-to-edge — no horizontal padding. */
export const TILE_WIDTH = (SCREEN_WIDTH - TILE_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

/** Height of a single thumbnail at the source aspect ratio. */
export const TILE_HEIGHT = TILE_WIDTH * PORTRAIT_RATIO;

/** Vertical pitch of a row, including the gap below it. */
export const ROW_HEIGHT = TILE_HEIGHT + TILE_GAP;
