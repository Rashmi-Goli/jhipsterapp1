export interface ILibrary {
  id?: number;
  libraryname?: string | null;
  address?: string | null;
}

export class Library implements ILibrary {
  constructor(public id?: number, public libraryname?: string | null, public address?: string | null) {}
}

export function getLibraryIdentifier(library: ILibrary): number | undefined {
  return library.id;
}
