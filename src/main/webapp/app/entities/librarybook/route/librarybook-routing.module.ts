import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LibrarybookComponent } from '../list/librarybook.component';
import { LibrarybookDetailComponent } from '../detail/librarybook-detail.component';
import { LibrarybookUpdateComponent } from '../update/librarybook-update.component';
import { LibrarybookRoutingResolveService } from './librarybook-routing-resolve.service';

const librarybookRoute: Routes = [
  {
    path: '',
    component: LibrarybookComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LibrarybookDetailComponent,
    resolve: {
      librarybook: LibrarybookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LibrarybookUpdateComponent,
    resolve: {
      librarybook: LibrarybookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LibrarybookUpdateComponent,
    resolve: {
      librarybook: LibrarybookRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(librarybookRoute)],
  exports: [RouterModule],
})
export class LibrarybookRoutingModule {}
