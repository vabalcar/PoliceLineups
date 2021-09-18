import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-import-person",
  templateUrl: "./import-person.component.html",
  styleUrls: ["./import-person.component.css"],
})
export class ImportPersonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  upload(event: Event): void {}
}
