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
 * Layout: 3-column 4:5 portrait grid (Instagram-style). Tile aspect is
 * shorter than the source dream's native 1024×1664 ratio so the grid
 * doesn't feel lanky on a phone — `contentFit="cover"` center-crops the
 * top/bottom (~23%), preserving the main subject in most compositions.
 */

import { Dimensions } from 'react-native';

export const NUM_COLUMNS = 3;
export const TILE_GAP = 2;

/** Tile aspect ratio (height / width). 4:5 = Instagram's modern portrait grid. */
export const PORTRAIT_RATIO = 5 / 4;

const SCREEN_WIDTH = Dimensions.get('window').width;

/** Width of a single thumbnail. Edge-to-edge — no horizontal padding. */
export const TILE_WIDTH = (SCREEN_WIDTH - TILE_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

/** Height of a single thumbnail at the source aspect ratio. */
export const TILE_HEIGHT = TILE_WIDTH * PORTRAIT_RATIO;

/** Vertical pitch of a row, including the gap below it. */
export const ROW_HEIGHT = TILE_HEIGHT + TILE_GAP;
