import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILibrarybook, Librarybook } from '../librarybook.model';
import { LibrarybookService } from '../service/librarybook.service';

@Injectable({ providedIn: 'root' })
export class LibrarybookRoutingResolveService implements Resolve<ILibrarybook> {
  constructor(protected service: LibrarybookService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILibrarybook> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((librarybook: HttpResponse<Librarybook>) => {
          if (librarybook.body) {
            return of(librarybook.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Librarybook());
  }
}
