export enum Folders {
  ALL = 'ALL',
  TRASH = 'TRASH',
  FAVORITES = 'FAVORITES',
  CATEGORY = 'CATEGORY',
}

export type FolderKey = keyof typeof Folders;