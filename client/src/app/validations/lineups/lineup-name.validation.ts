import { Observable } from "rxjs";

import { RequiredValidation } from "../required.validation";

export class LineupNameValidation extends RequiredValidation<string> {
  constructor(defaultValue$?: Observable<string>) {
    super("Lineup name", defaultValue$);
  }
}
