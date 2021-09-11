import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ImportPersonComponent } from "./import-person.component";

describe("ImportPersonComponent", () => {
  let component: ImportPersonComponent;
  let fixture: ComponentFixture<ImportPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportPersonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
