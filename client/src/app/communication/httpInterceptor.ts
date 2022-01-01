import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { BASE_PATH } from "../api/variables";

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private blobsBasePath: string;

  constructor(@Inject(BASE_PATH) basePath: string) {
    this.blobsBasePath = `${basePath}/blobs/`;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isBlobRequest(req)) {
      req = req.clone({
        responseType: "blob",
      });
    }

    return next.handle(req);
  }

  private isBlobRequest(req: HttpRequest<any>): boolean {
    return req.url.startsWith(this.blobsBasePath);
  }
}
