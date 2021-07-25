import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILibrarybook, Librarybook } from '../librarybook.model';

import { LibrarybookService } from './librarybook.service';

describe('Service Tests', () => {
  describe('Librarybook Service', () => {
    let service: LibrarybookService;
    let httpMock: HttpTestingController;
    let elemDefault: ILibrarybook;
    let expectedResult: ILibrarybook | ILibrarybook[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(LibrarybookService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        author: 'AAAAAAA',
        publisher: 'AAAAAAA',
        instock: false,
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

      it('should create a Librarybook', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Librarybook()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Librarybook', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            author: 'BBBBBB',
            publisher: 'BBBBBB',
            instock: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Librarybook', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            author: 'BBBBBB',
            publisher: 'BBBBBB',
            instock: true,
          },
          new Librarybook()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Librarybook', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            author: 'BBBBBB',
            publisher: 'BBBBBB',
            instock: true,
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

      it('should delete a Librarybook', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addLibrarybookToCollectionIfMissing', () => {
        it('should add a Librarybook to an empty array', () => {
          const librarybook: ILibrarybook = { id: 123 };
          expectedResult = service.addLibrarybookToCollectionIfMissing([], librarybook);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(librarybook);
        });

        it('should not add a Librarybook to an array that contains it', () => {
          const librarybook: ILibrarybook = { id: 123 };
          const librarybookCollection: ILibrarybook[] = [
            {
              ...librarybook,
            },
            { id: 456 },
          ];
          expectedResult = service.addLibrarybookToCollectionIfMissing(librarybookCollection, librarybook);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Librarybook to an array that doesn't contain it", () => {
          const librarybook: ILibrarybook = { id: 123 };
          const librarybookCollection: ILibrarybook[] = [{ id: 456 }];
          expectedResult = service.addLibrarybookToCollectionIfMissing(librarybookCollection, librarybook);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(librarybook);
        });

        it('should add only unique Librarybook to an array', () => {
          const librarybookArray: ILibrarybook[] = [{ id: 123 }, { id: 456 }, { id: 24110 }];
          const librarybookCollection: ILibrarybook[] = [{ id: 123 }];
          expectedResult = service.addLibrarybookToCollectionIfMissing(librarybookCollection, ...librarybookArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const librarybook: ILibrarybook = { id: 123 };
          const librarybook2: ILibrarybook = { id: 456 };
          expectedResult = service.addLibrarybookToCollectionIfMissing([], librarybook, librarybook2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(librarybook);
          expect(expectedResult).toContain(librarybook2);
        });

        it('should accept null and undefined values', () => {
          const librarybook: ILibrarybook = { id: 123 };
          expectedResult = service.addLibrarybookToCollectionIfMissing([], null, librarybook, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(librarybook);
        });

        it('should return initial array if no Librarybook is added', () => {
          const librarybookCollection: ILibrarybook[] = [{ id: 123 }];
          expectedResult = service.addLibrarybookToCollectionIfMissing(librarybookCollection, undefined, null);
          expect(expectedResult).toEqual(librarybookCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
