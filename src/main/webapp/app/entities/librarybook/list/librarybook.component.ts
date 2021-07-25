import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILibrarybook } from '../librarybook.model';
import { LibrarybookService } from '../service/librarybook.service';
import { LibrarybookDeleteDialogComponent } from '../delete/librarybook-delete-dialog.component';

@Component({
  selector: 'jhi-librarybook',
  templateUrl: './librarybook.component.html',
})
export class LibrarybookComponent implements OnInit {
  librarybooks?: ILibrarybook[];
  isLoading = false;

  constructor(protected librarybookService: LibrarybookService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.librarybookService.query().subscribe(
      (res: HttpResponse<ILibrarybook[]>) => {
        this.isLoading = false;
        this.librarybooks = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILibrarybook): number {
    return item.id!;
  }

  delete(librarybook: ILibrarybook): void {
    const modalRef = this.modalService.open(LibrarybookDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.librarybook = librarybook;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
