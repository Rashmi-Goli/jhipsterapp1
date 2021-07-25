import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'librarybook',
        data: { pageTitle: 'Librarybooks' },
        loadChildren: () => import('./librarybook/librarybook.module').then(m => m.LibrarybookModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
