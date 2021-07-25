import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILibrarybook, getLibrarybookIdentifier } from '../librarybook.model';

export type EntityResponseType = HttpResponse<ILibrarybook>;
export type EntityArrayResponseType = HttpResponse<ILibrarybook[]>;

@Injectable({ providedIn: 'root' })
export class LibrarybookService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/librarybooks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(librarybook: ILibrarybook): Observable<EntityResponseType> {
    return this.http.post<ILibrarybook>(this.resourceUrl, librarybook, { observe: 'response' });
  }

  update(librarybook: ILibrarybook): Observable<EntityResponseType> {
    return this.http.put<ILibrarybook>(`${this.resourceUrl}/${getLibrarybookIdentifier(librarybook) as number}`, librarybook, {
      observe: 'response',
    });
  }

  partialUpdate(librarybook: ILibrarybook): Observable<EntityResponseType> {
    return this.http.patch<ILibrarybook>(`${this.resourceUrl}/${getLibrarybookIdentifier(librarybook) as number}`, librarybook, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILibrarybook>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILibrarybook[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLibrarybookToCollectionIfMissing(
    librarybookCollection: ILibrarybook[],
    ...librarybooksToCheck: (ILibrarybook | null | undefined)[]
  ): ILibrarybook[] {
    const librarybooks: ILibrarybook[] = librarybooksToCheck.filter(isPresent);
    if (librarybooks.length > 0) {
      const librarybookCollectionIdentifiers = librarybookCollection.map(librarybookItem => getLibrarybookIdentifier(librarybookItem)!);
      const librarybooksToAdd = librarybooks.filter(librarybookItem => {
        const librarybookIdentifier = getLibrarybookIdentifier(librarybookItem);
        if (librarybookIdentifier == null || librarybookCollectionIdentifiers.includes(librarybookIdentifier)) {
          return false;
        }
        librarybookCollectionIdentifiers.push(librarybookIdentifier);
        return true;
      });
      return [...librarybooksToAdd, ...librarybookCollection];
    }
    return librarybookCollection;
  }
}
