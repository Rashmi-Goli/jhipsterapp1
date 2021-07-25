export interface ILibrarybook {
  id?: number;
  name?: string | null;
  author?: string | null;
  publisher?: string | null;
  instock?: boolean | null;
}

export class Librarybook implements ILibrarybook {
  constructor(
    public id?: number,
    public name?: string | null,
    public author?: string | null,
    public publisher?: string | null,
    public instock?: boolean | null
  ) {
    this.instock = this.instock ?? false;
  }
}

export function getLibrarybookIdentifier(librarybook: ILibrarybook): number | undefined {
  return librarybook.id;
}
