import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";

@Injectable({
  providedIn: "root",
})
export class BlobsService {
  constructor(private api: DefaultService, private sanitizer: DomSanitizer) {}

  getBlobUrl(blobName: string): Observable<SafeUrl> {
    return this.api
      .getBlob(blobName)
      .pipe(
        map((blob) =>
          this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(blob)
          )
        )
      );
  }
}
