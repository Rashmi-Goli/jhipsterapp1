import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILibrary } from '../library.model';
import { LibraryService } from '../service/library.service';
import { LibraryDeleteDialogComponent } from '../delete/library-delete-dialog.component';

@Component({
  selector: 'jhi-library',
  templateUrl: './library.component.html',
})
export class LibraryComponent implements OnInit {
  libraries?: ILibrary[];
  isLoading = false;

  constructor(protected libraryService: LibraryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.libraryService.query().subscribe(
      (res: HttpResponse<ILibrary[]>) => {
        this.isLoading = false;
        this.libraries = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILibrary): number {
    return item.id!;
  }

  delete(library: ILibrary): void {
    const modalRef = this.modalService.open(LibraryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.library = library;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
