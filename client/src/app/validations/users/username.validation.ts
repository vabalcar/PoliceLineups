import { RequiredValidation } from "../required.validation";
import { BeValidation } from "../utils/BeValidation";

export class UsernameValidation extends RequiredValidation<string> {
  constructor(beValidation?: BeValidation<string>) {
    super("Username", undefined, beValidation);
  }
}
