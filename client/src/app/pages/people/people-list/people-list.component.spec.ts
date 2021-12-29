import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveComponentModule } from "@ngrx/component";
import { of } from "rxjs";
import { DefaultService } from "src/app/api/api/default.service";

import { PeopleListComponent } from "./people-list.component";

describe("PeopleComponent", () => {
  let component: PeopleListComponent;
  let fixture: ComponentFixture<PeopleListComponent>;

  beforeEach(async () => {
    spyOn(DefaultService.prototype, "getPeople").and.returnValue(of([]) as any);

    await TestBed.configureTestingModule({
      declarations: [PeopleListComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveComponentModule],
      providers: [
        { provide: DefaultService, useValue: DefaultService.prototype },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleListComponent);
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
