import { Component, OnInit } from "@angular/core";
import { FileHandle } from "src/app/directives/drop-zone.directive";

interface INationality {
  name: string;
  value: string;
}

@Component({
  selector: "app-import-person",
  templateUrl: "./import-person.component.html",
  styleUrls: ["./import-person.component.css"],
})
export class ImportPersonComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {}

  import(): void {}

  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }
}
