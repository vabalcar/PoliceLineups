import { Observable } from "rxjs";
import { FormValidationBase } from "src/app/validations/utils/FormValidationBase";

export interface FilterChipData {
  validation: FormValidationBase<any>;
  message$: Observable<string | undefined>;
}
