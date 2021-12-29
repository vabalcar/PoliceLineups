import { Observable } from "rxjs";

import { RequiredValidation } from "./required.validation";

export class FullNameValidation extends RequiredValidation<string> {
  constructor(defaultValue$?: Observable<string>) {
    super("Full name", defaultValue$);
  }
}
