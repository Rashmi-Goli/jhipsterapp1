jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILibrarybook, Librarybook } from '../librarybook.model';
import { LibrarybookService } from '../service/librarybook.service';

import { LibrarybookRoutingResolveService } from './librarybook-routing-resolve.service';

describe('Service Tests', () => {
  describe('Librarybook routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LibrarybookRoutingResolveService;
    let service: LibrarybookService;
    let resultLibrarybook: ILibrarybook | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LibrarybookRoutingResolveService);
      service = TestBed.inject(LibrarybookService);
      resultLibrarybook = undefined;
    });

    describe('resolve', () => {
      it('should return ILibrarybook returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLibrarybook = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLibrarybook).toEqual({ id: 123 });
      });

      it('should return new ILibrarybook if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLibrarybook = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLibrarybook).toEqual(new Librarybook());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Librarybook })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLibrarybook = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLibrarybook).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
