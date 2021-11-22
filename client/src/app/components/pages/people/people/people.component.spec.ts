import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReactiveComponentModule } from "@ngrx/component";
import { of } from "rxjs";

import { DefaultService } from "src/app/api/api/default.service";

import { PeopleComponent } from "./people.component";

describe("PeopleComponent", () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    spyOn(DefaultService.prototype, "getPeople").and.returnValue(of([]) as any);

    await TestBed.configureTestingModule({
      declarations: [PeopleComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveComponentModule],
      providers: [
        { provide: DefaultService, useValue: DefaultService.prototype },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
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
