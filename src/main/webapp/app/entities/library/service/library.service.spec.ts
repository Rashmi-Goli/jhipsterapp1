import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILibrary, Library } from '../library.model';

import { LibraryService } from './library.service';

describe('Service Tests', () => {
  describe('Library Service', () => {
    let service: LibraryService;
    let httpMock: HttpTestingController;
    let elemDefault: ILibrary;
    let expectedResult: ILibrary | ILibrary[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LibraryService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        libraryname: 'AAAAAAA',
        address: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Library', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Library()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Library', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            libraryname: 'BBBBBB',
            address: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Library', () => {
        const patchObject = Object.assign(
          {
            address: 'BBBBBB',
          },
          new Library()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Library', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            libraryname: 'BBBBBB',
            address: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Library', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLibraryToCollectionIfMissing', () => {
        it('should add a Library to an empty array', () => {
          const library: ILibrary = { id: 123 };
          expectedResult = service.addLibraryToCollectionIfMissing([], library);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(library);
        });

        it('should not add a Library to an array that contains it', () => {
          const library: ILibrary = { id: 123 };
          const libraryCollection: ILibrary[] = [
            {
              ...library,
            },
            { id: 456 },
          ];
          expectedResult = service.addLibraryToCollectionIfMissing(libraryCollection, library);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Library to an array that doesn't contain it", () => {
          const library: ILibrary = { id: 123 };
          const libraryCollection: ILibrary[] = [{ id: 456 }];
          expectedResult = service.addLibraryToCollectionIfMissing(libraryCollection, library);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(library);
        });

        it('should add only unique Library to an array', () => {
          const libraryArray: ILibrary[] = [{ id: 123 }, { id: 456 }, { id: 93786 }];
          const libraryCollection: ILibrary[] = [{ id: 123 }];
          expectedResult = service.addLibraryToCollectionIfMissing(libraryCollection, ...libraryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const library: ILibrary = { id: 123 };
          const library2: ILibrary = { id: 456 };
          expectedResult = service.addLibraryToCollectionIfMissing([], library, library2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(library);
          expect(expectedResult).toContain(library2);
        });

        it('should accept null and undefined values', () => {
          const library: ILibrary = { id: 123 };
          expectedResult = service.addLibraryToCollectionIfMissing([], null, library, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(library);
        });

        it('should return initial array if no Library is added', () => {
          const libraryCollection: ILibrary[] = [{ id: 123 }];
          expectedResult = service.addLibraryToCollectionIfMissing(libraryCollection, undefined, null);
          expect(expectedResult).toEqual(libraryCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
