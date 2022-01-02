import { Observable } from "rxjs";

import { RequiredValidation } from "../required.validation";

export class NationalityValidation extends RequiredValidation<string> {
  constructor(defaultValue$?: Observable<string>) {
    super("Nationality", defaultValue$);
  }
}
