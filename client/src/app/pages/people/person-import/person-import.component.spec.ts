import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PersonImportComponent } from "./person-import.component";

describe("ImportPersonComponent", () => {
  let component: PersonImportComponent;
  let fixture: ComponentFixture<PersonImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonImportComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonImportComponent);
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
