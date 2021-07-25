import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILibrarybook } from '../librarybook.model';

@Component({
  selector: 'jhi-librarybook-detail',
  templateUrl: './librarybook-detail.component.html',
})
export class LibrarybookDetailComponent implements OnInit {
  librarybook: ILibrarybook | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ librarybook }) => {
      this.librarybook = librarybook;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
