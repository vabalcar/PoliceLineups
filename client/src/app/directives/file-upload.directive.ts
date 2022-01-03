import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

import { BlobsService } from "../services/blobs/blobs.service";
import { BlobHandle } from "../utils/BlobHandle";

@Directive({
  selector: "[appFileUpload]",
})
export class FileUploadDirective {
  @Output()
  selectFiles = new EventEmitter<BlobHandle[]>();

  constructor(private blobs: BlobsService) {}

  @HostListener("change", ["$event"])
  onChange(event: any) {
    event.preventDefault();
    event.stopPropagation();

    const blobHandles: BlobHandle[] = Array.from(event.target.files).map(
      (blob: Blob) => ({
        blob,
        url: this.blobs.getUrlForBlob(blob),
      })
    );

    if (!blobHandles?.length) {
      return;
    }

    this.selectFiles.emit(blobHandles);
  }
}
