import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LibraryService } from '../service/library.service';

import { LibraryComponent } from './library.component';

describe('Component Tests', () => {
  describe('Library Management Component', () => {
    let comp: LibraryComponent;
    let fixture: ComponentFixture<LibraryComponent>;
    let service: LibraryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LibraryComponent],
      })
        .overrideTemplate(LibraryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LibraryComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(LibraryService);

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
      expect(comp.libraries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
