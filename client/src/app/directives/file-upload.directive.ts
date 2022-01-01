import { Directive, EventEmitter, HostListener, Output } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { FileHandle } from "../utils/FileHandle";

@Directive({
  selector: "[appFileUpload]",
})
export class FileUploadDirective {
  @Output()
  filesSelected = new EventEmitter<FileHandle[]>();

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener("change", ["$event"])
  onChange(event: any) {
    event.preventDefault();
    event.stopPropagation();

    const files: FileHandle[] = Array.from(event.target.files).map(
      (file: File) => ({
        file,
        url: this.getUrlForFile(file),
      })
    );

    if (files) {
      this.filesSelected.emit(files);
    }
  }

  private getUrlForFile(file: File): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
  }
}
