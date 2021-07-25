jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ILibrary, Library } from '../library.model';
import { LibraryService } from '../service/library.service';

import { LibraryRoutingResolveService } from './library-routing-resolve.service';

describe('Service Tests', () => {
  describe('Library routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: LibraryRoutingResolveService;
    let service: LibraryService;
    let resultLibrary: ILibrary | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(LibraryRoutingResolveService);
      service = TestBed.inject(LibraryService);
      resultLibrary = undefined;
    });

    describe('resolve', () => {
      it('should return ILibrary returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLibrary = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLibrary).toEqual({ id: 123 });
      });

      it('should return new ILibrary if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLibrary = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultLibrary).toEqual(new Library());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Library })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultLibrary = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultLibrary).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
