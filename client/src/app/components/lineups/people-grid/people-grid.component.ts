import { Component, Input, OnInit } from "@angular/core";
import { SafeUrl } from "@angular/platform-browser";

@Component({
  selector: "app-people-grid",
  templateUrl: "./people-grid.component.html",
})
export class PeopleGridComponent implements OnInit {
  @Input("appPeoplePhotoUrls")
  peoplePhotoUrls: SafeUrl[];

  ngOnInit(): void {
    this.peoplePhotoUrls ??= [];
  }
}
