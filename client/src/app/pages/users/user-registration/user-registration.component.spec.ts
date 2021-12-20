import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveComponentModule } from "@ngrx/component";
import { provideMockStore } from "@ngrx/store/testing";
import { DefaultService } from "src/app/api/api/default.service";

import { UserRegistrationComponent } from "./user-registration.component";

describe("UserRegistrationComponent", () => {
  let component: UserRegistrationComponent;
  let fixture: ComponentFixture<UserRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRegistrationComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveComponentModule],
      providers: [
        provideMockStore(),
        { provide: DefaultService, useValue: DefaultService.prototype },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegistrationComponent);
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
