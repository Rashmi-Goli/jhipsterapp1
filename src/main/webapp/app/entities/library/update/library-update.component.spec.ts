jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LibraryService } from '../service/library.service';
import { ILibrary, Library } from '../library.model';

import { LibraryUpdateComponent } from './library-update.component';

describe('Component Tests', () => {
  describe('Library Management Update Component', () => {
    let comp: LibraryUpdateComponent;
    let fixture: ComponentFixture<LibraryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let libraryService: LibraryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LibraryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LibraryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LibraryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      libraryService = TestBed.inject(LibraryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const library: ILibrary = { id: 456 };

        activatedRoute.data = of({ library });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(library));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Library>>();
        const library = { id: 123 };
        jest.spyOn(libraryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ library });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: library }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(libraryService.update).toHaveBeenCalledWith(library);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Library>>();
        const library = new Library();
        jest.spyOn(libraryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ library });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: library }));
        saveSubject.complete();

        // THEN
        expect(libraryService.create).toHaveBeenCalledWith(library);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Library>>();
        const library = { id: 123 };
        jest.spyOn(libraryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ library });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(libraryService.update).toHaveBeenCalledWith(library);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
