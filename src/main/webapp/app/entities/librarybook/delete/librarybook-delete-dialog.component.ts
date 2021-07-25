import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILibrarybook } from '../librarybook.model';
import { LibrarybookService } from '../service/librarybook.service';

@Component({
  templateUrl: './librarybook-delete-dialog.component.html',
})
export class LibrarybookDeleteDialogComponent {
  librarybook?: ILibrarybook;

  constructor(protected librarybookService: LibrarybookService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.librarybookService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
