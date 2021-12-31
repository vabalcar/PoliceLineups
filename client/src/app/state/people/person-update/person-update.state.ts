import { SafeUrl } from "@angular/platform-browser";
import { Person } from "src/app/api/model/person";

export interface PersonUpdateState extends Person {
  photoUrl?: SafeUrl;
}
