import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LibrarybookDetailComponent } from './librarybook-detail.component';

describe('Component Tests', () => {
  describe('Librarybook Management Detail Component', () => {
    let comp: LibrarybookDetailComponent;
    let fixture: ComponentFixture<LibrarybookDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LibrarybookDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ librarybook: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LibrarybookDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LibrarybookDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load librarybook on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.librarybook).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
