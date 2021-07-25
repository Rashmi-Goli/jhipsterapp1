import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LibraryDetailComponent } from './library-detail.component';

describe('Component Tests', () => {
  describe('Library Management Detail Component', () => {
    let comp: LibraryDetailComponent;
    let fixture: ComponentFixture<LibraryDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LibraryDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ library: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(LibraryDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LibraryDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load library on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.library).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
