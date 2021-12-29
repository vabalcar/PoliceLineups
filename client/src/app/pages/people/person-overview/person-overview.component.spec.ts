import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { DefaultService } from "src/app/api/api/default.service";
import { Person } from "src/app/api/model/models";

import { PersonOverviewComponent } from "./person-overview.component";

describe("PersonComponent", () => {
  let component: PersonOverviewComponent;
  let fixture: ComponentFixture<PersonOverviewComponent>;

  const person: Person = {};

  beforeEach(async () => {
    spyOn(DefaultService.prototype, "getPerson").and.returnValue(
      of(person) as any
    );

    await TestBed.configureTestingModule({
      declarations: [PersonOverviewComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule],
      providers: [
        { provide: DefaultService, useValue: DefaultService.prototype },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonOverviewComponent);
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
