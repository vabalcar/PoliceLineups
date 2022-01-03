import { Component, Input, OnInit } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";
import { BehaviorSubject, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { BlobHandle } from "src/app/utils/BlobHandle";

@Component({
  selector: "app-photo-selector",
  templateUrl: "./photo-selector.component.html",
  styleUrls: ["./photo-selector.component.css"],
})
export class PhotoSelectorComponent implements OnInit {
  @Input("appPhotoSubject")
  photoSubject$: BehaviorSubject<BlobHandle | undefined>;

  @Input("appSrc")
  set initSrc(value: SafeUrl) {
    this.photoUrlSubject$.next(value);
  }

  @Input("appDropzoneHeight")
  dropzoneHeight = "400px";

  @Input("appDropzoneWidth")
  dropzoneWidth = "400px";

  photoUrlSubject$: BehaviorSubject<SafeUrl | undefined>;
  photoUrlSubscription: Subscription;

  constructor() {
    this.photoUrlSubject$ = new BehaviorSubject<SafeUrl | undefined>(undefined);
  }

  ngOnInit(): void {
    this.photoUrlSubscription = this.photoSubject$
      ?.asObservable()
      .pipe(map((photo) => photo?.url))
      .subscribe(this.photoUrlSubject$);
  }

  filesSelected(blobHandles: BlobHandle[]): void {
    this.photoSubject$?.next(blobHandles?.length ? blobHandles[0] : undefined);
  }
}
