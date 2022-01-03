import { Component, Input, OnInit } from "@angular/core";
import { FilterChipData } from "./FilterChipData";

@Component({
  selector: "app-filter-chip-list",
  templateUrl: "./filter-chip-list.component.html",
})
export class FilterChipListComponent implements OnInit {
  @Input("appFilterChipsData")
  filterChipsData: Array<FilterChipData>;

  ngOnInit(): void {
    this.filterChipsData ??= [];
  }
}
