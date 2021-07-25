import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LibrarybookComponent } from './list/librarybook.component';
import { LibrarybookDetailComponent } from './detail/librarybook-detail.component';
import { LibrarybookUpdateComponent } from './update/librarybook-update.component';
import { LibrarybookDeleteDialogComponent } from './delete/librarybook-delete-dialog.component';
import { LibrarybookRoutingModule } from './route/librarybook-routing.module';

@NgModule({
  imports: [SharedModule, LibrarybookRoutingModule],
  declarations: [LibrarybookComponent, LibrarybookDetailComponent, LibrarybookUpdateComponent, LibrarybookDeleteDialogComponent],
  entryComponents: [LibrarybookDeleteDialogComponent],
})
export class LibrarybookModule {}
