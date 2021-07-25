import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILibrary, getLibraryIdentifier } from '../library.model';

export type EntityResponseType = HttpResponse<ILibrary>;
export type EntityArrayResponseType = HttpResponse<ILibrary[]>;

@Injectable({ providedIn: 'root' })
export class LibraryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/libraries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(library: ILibrary): Observable<EntityResponseType> {
    return this.http.post<ILibrary>(this.resourceUrl, library, { observe: 'response' });
  }

  update(library: ILibrary): Observable<EntityResponseType> {
    return this.http.put<ILibrary>(`${this.resourceUrl}/${getLibraryIdentifier(library) as number}`, library, { observe: 'response' });
  }

  partialUpdate(library: ILibrary): Observable<EntityResponseType> {
    return this.http.patch<ILibrary>(`${this.resourceUrl}/${getLibraryIdentifier(library) as number}`, library, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILibrary>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILibrary[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLibraryToCollectionIfMissing(libraryCollection: ILibrary[], ...librariesToCheck: (ILibrary | null | undefined)[]): ILibrary[] {
    const libraries: ILibrary[] = librariesToCheck.filter(isPresent);
    if (libraries.length > 0) {
      const libraryCollectionIdentifiers = libraryCollection.map(libraryItem => getLibraryIdentifier(libraryItem)!);
      const librariesToAdd = libraries.filter(libraryItem => {
        const libraryIdentifier = getLibraryIdentifier(libraryItem);
        if (libraryIdentifier == null || libraryCollectionIdentifiers.includes(libraryIdentifier)) {
          return false;
        }
        libraryCollectionIdentifiers.push(libraryIdentifier);
        return true;
      });
      return [...librariesToAdd, ...libraryCollection];
    }
    return libraryCollection;
  }
}
