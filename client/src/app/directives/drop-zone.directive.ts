import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from "@angular/core";

import { BlobsService } from "../services/blobs/blobs.service";
import { BlobHandle } from "../utils/BlobHandle";

@Directive({
  selector: "[appDropZone]",
})
export class DropZoneDirective {
  @Output()
  dropFiles = new EventEmitter<BlobHandle[]>();

  @HostBinding("style.backgroundColor")
  backgroundColor: string | undefined;

  readonly dragOverBackgroundColor = this.getCssVariableValue(
    "--user-interaction-color"
  );

  constructor(private blobs: BlobsService) {}

  @HostListener("dragover", ["$event"])
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.backgroundColor = this.dragOverBackgroundColor;
  }

  @HostListener("dragleave", ["$event"])
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.resetBackgroundColor();
  }

  @HostListener("drop", ["$event"])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.resetBackgroundColor();

    const blobHandles: BlobHandle[] = Array.from(event.dataTransfer.files).map(
      (blob: Blob) => ({
        blob,
        url: this.blobs.getUrlForBlob(blob),
      })
    );

    if (!blobHandles?.length) {
      return;
    }

    this.dropFiles.emit(blobHandles);
  }

  private resetBackgroundColor(): void {
    this.backgroundColor = undefined;
  }

  private getCssVariableValue(name: string): string {
    return getComputedStyle(document.body).getPropertyValue(name);
  }
}
