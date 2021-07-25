import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LibrarybookService } from '../service/librarybook.service';

import { LibrarybookComponent } from './librarybook.component';

describe('Component Tests', () => {
  describe('Librarybook Management Component', () => {
    let comp: LibrarybookComponent;
    let fixture: ComponentFixture<LibrarybookComponent>;
    let service: LibrarybookService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LibrarybookComponent],
      })
        .overrideTemplate(LibrarybookComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LibrarybookComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LibrarybookService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.librarybooks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
