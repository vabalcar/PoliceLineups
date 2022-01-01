import { Component, EventEmitter, Output } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { FileHandle } from "src/app/utils/FileHandle";

@Component({
  selector: "app-photo-selector",
  templateUrl: "./photo-selector.component.html",
})
export class PhotoSelectorComponent {
  @Output()
  readonly photoSelected = new EventEmitter<File | undefined>();

  readonly photoSubject$: BehaviorSubject<FileHandle | undefined>;
  readonly selectedPhotoEmitation: Subscription;

  constructor() {
    this.photoSubject$ = new BehaviorSubject(undefined);
    this.selectedPhotoEmitation = this.photoSubject$.subscribe((fileHandle) =>
      this.photoSelected.emit(fileHandle?.file)
    );
  }

  filesSelected(fileHandles: FileHandle[]): void {
    this.photoSubject$.next(fileHandles?.length ? fileHandles[0] : undefined);
  }
}
