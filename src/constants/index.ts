export enum Folders {
  ALL = 'ALL',
  TRASH = 'TRASH',
  FAVORITES = 'FAVORITES',
  CATEGORY = 'CATEGORY',
}

export type FolderKey = keyof typeof Folders;

export const iconColor = 'rgba(255, 255, 255, 0.25)'