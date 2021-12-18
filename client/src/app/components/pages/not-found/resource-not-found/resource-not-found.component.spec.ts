import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveComponentModule } from "@ngrx/component";
import { provideMockStore } from "@ngrx/store/testing";

import { ResourceNotFoundComponent } from "./resource-not-found.component";

describe("NotFoundComponent", () => {
  let component: ResourceNotFoundComponent;
  let fixture: ComponentFixture<ResourceNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResourceNotFoundComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [ReactiveComponentModule],
      providers: [provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceNotFoundComponent);
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
