import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { BlobHandle } from "src/app/utils/BlobHandle";

@Injectable({
  providedIn: "root",
})
export class BlobsService {
  constructor(private api: DefaultService, private sanitizer: DomSanitizer) {}

  getBlob(blobName: string): Observable<BlobHandle> {
    return this.api.getBlob(blobName).pipe(
      map((blob) => ({
        blob,
        url: this.getUrlForBlob(blob),
      }))
    );
  }

  getUrlForBlob(blob: Blob): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(blob)
    );
  }
}
