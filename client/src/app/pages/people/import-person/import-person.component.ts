import { Component } from "@angular/core";
import { FileHandle } from "src/app/directives/drop-zone.directive";

interface INationality {
  name: string;
  value: string;
}

@Component({
  templateUrl: "./import-person.component.html",
  styleUrls: ["./import-person.component.css"],
})
export class ImportPersonComponent {
  name: string;
  born: Date;
  nationality: string;

  files?: FileHandle[];

  nationalities: INationality[] = [
    { name: "afghan", value: "Afghan" },
    { name: "albanian", value: "Albanian" },
    { name: "algerian", value: "Algerian" },
    { name: "argentinian", value: "Argentinian" },
    { name: "australian", value: "Australian" },
  ];

  import(): void {}

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }
}
