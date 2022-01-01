import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { FileHandle } from "../utils/FileHandle";

@Directive({
  selector: "[appDropZone]",
})
export class DropZoneDirective {
  @Output()
  dropFiles = new EventEmitter<FileHandle[]>();

  @HostBinding("style.backgroundColor")
  backgroundColor: string | undefined;

  readonly dragOverBackgroundColor = this.getCssVariableValue(
    "--user-interaction-color"
  );

  constructor(private sanitizer: DomSanitizer) {}

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

    const files: FileHandle[] = Array.from(event.dataTransfer.files).map(
      (file: File) => ({
        file,
        url: this.getUrlForFile(file),
      })
    );

    if (files) {
      this.dropFiles.emit(files);
    }
  }

  private getUrlForFile(file: File): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(file)
    );
  }

  private resetBackgroundColor(): void {
    this.backgroundColor = undefined;
  }

  private getCssVariableValue(name: string): string {
    return getComputedStyle(document.body).getPropertyValue(name);
  }
}
