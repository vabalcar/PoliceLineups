import { Component, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FileHandle } from "src/app/utils/FileHandle";

@Component({
  selector: "app-photo-selector",
  templateUrl: "./photo-selector.component.html",
  styleUrls: ["./photo-selector.component.css"],
})
export class PhotoSelectorComponent {
  @Input("app-photo-subject")
  photoSubject$: BehaviorSubject<FileHandle | undefined>;

  @Input("dropzone-height")
  dropzoneHeight = "400px";

  @Input("dropzone-width")
  dropzoneWidth = "400px";

  filesSelected(fileHandles: FileHandle[]): void {
    this.photoSubject$?.next(fileHandles?.length ? fileHandles[0] : undefined);
  }
}
