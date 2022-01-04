import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DefaultService } from "src/app/api/api/default.service";
import { Person } from "src/app/api/model/person";
import { PersonWithPhotoUrl } from "src/app/state/people/utils/PersonWithPhotoUrl";
import { BlobHandle } from "src/app/utils/BlobHandle";

@Injectable()
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

  getPhotos(people: Person[]): Observable<PersonWithPhotoUrl[]> {
    return combineLatest(
      people.map((person) =>
        this.api.getBlob(person.photoBlobName).pipe(
          map(
            (blob) =>
              ({
                ...person,
                photoUrl: this.getUrlForBlob(blob),
              } as PersonWithPhotoUrl)
          )
        )
      )
    );
  }

  getUrlForBlob(blob: Blob): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(blob)
    );
  }
}
