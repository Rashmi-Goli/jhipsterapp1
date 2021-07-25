jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LibrarybookService } from '../service/librarybook.service';
import { ILibrarybook, Librarybook } from '../librarybook.model';

import { LibrarybookUpdateComponent } from './librarybook-update.component';

describe('Component Tests', () => {
  describe('Librarybook Management Update Component', () => {
    let comp: LibrarybookUpdateComponent;
    let fixture: ComponentFixture<LibrarybookUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let librarybookService: LibrarybookService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LibrarybookUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LibrarybookUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LibrarybookUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      librarybookService = TestBed.inject(LibrarybookService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const librarybook: ILibrarybook = { id: 456 };

        activatedRoute.data = of({ librarybook });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(librarybook));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Librarybook>>();
        const librarybook = { id: 123 };
        jest.spyOn(librarybookService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ librarybook });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: librarybook }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(librarybookService.update).toHaveBeenCalledWith(librarybook);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Librarybook>>();
        const librarybook = new Librarybook();
        jest.spyOn(librarybookService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ librarybook });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: librarybook }));
        saveSubject.complete();

        // THEN
        expect(librarybookService.create).toHaveBeenCalledWith(librarybook);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Librarybook>>();
        const librarybook = { id: 123 };
        jest.spyOn(librarybookService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ librarybook });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(librarybookService.update).toHaveBeenCalledWith(librarybook);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
