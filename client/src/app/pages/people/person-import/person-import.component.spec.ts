import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ImportPersonComponent } from "./person-import.component";

describe("ImportPersonComponent", () => {
  let component: ImportPersonComponent;
  let fixture: ComponentFixture<ImportPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportPersonComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
