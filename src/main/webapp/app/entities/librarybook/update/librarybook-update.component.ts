import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILibrarybook, Librarybook } from '../librarybook.model';
import { LibrarybookService } from '../service/librarybook.service';

@Component({
  selector: 'jhi-librarybook-update',
  templateUrl: './librarybook-update.component.html',
})
export class LibrarybookUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [],
    author: [],
    publisher: [],
    instock: [],
  });

  constructor(protected librarybookService: LibrarybookService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ librarybook }) => {
      this.updateForm(librarybook);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const librarybook = this.createFromForm();
    if (librarybook.id !== undefined) {
      this.subscribeToSaveResponse(this.librarybookService.update(librarybook));
    } else {
      this.subscribeToSaveResponse(this.librarybookService.create(librarybook));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILibrarybook>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(librarybook: ILibrarybook): void {
    this.editForm.patchValue({
      id: librarybook.id,
      name: librarybook.name,
      author: librarybook.author,
      publisher: librarybook.publisher,
      instock: librarybook.instock,
    });
  }

  protected createFromForm(): ILibrarybook {
    return {
      ...new Librarybook(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      author: this.editForm.get(['author'])!.value,
      publisher: this.editForm.get(['publisher'])!.value,
      instock: this.editForm.get(['instock'])!.value,
    };
  }
}
