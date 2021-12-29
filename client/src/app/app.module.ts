import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { ReactiveComponentModule } from "@ngrx/component";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "src/environments/environment";

import { DefaultService } from "./api/api/default.service";
import { BASE_PATH } from "./api/variables";
import { AppComponent } from "./components/app/app.component";
import { DropZoneDirective } from "./directives/drop-zone.directive";
import { ReactivelyDisabledControlDirective } from "./directives/reactively-disabled-control.directive";
import { LoginComponent } from "./pages/auth/login/login.component";
import { NotAuthorizedComponent } from "./pages/auth/not-authorized/not-authorized.component";
import { HomeComponent } from "./pages/home/home.component";
import { PathNotFoundComponent } from "./pages/not-found/path-not-found/path-not-found.component";
import { ResourceNotFoundComponent } from "./pages/not-found/resource-not-found/resource-not-found.component";
import { PeopleComponent } from "./pages/people/people/people.component";
import { ImportPersonComponent } from "./pages/people/person-import/person-import.component";
import { PersonComponent } from "./pages/people/person/person.component";
import { UserOverviewComponent } from "./pages/users/user-overview/user-overview.component";
import { UserRegistrationComponent } from "./pages/users/user-registration/user-registration.component";
import { UserSettingsComponent } from "./pages/users/user-settings/user-settings.component";
import { UsersListComponent } from "./pages/users/users-list/users-list.component";
import { AppRoutingModule } from "./routing/app-routing.module";
import { AppEffects } from "./state/app.effects";
import { reducers } from "./state/app.reducer";
import { AuthEffects } from "./state/auth/auth.effects";
import { PeopleListEffects } from "./state/people/people-list/people-list.effects";
import { PersonImportEffects } from "./state/people/person-import/person-import.effects";
import { PersonUpdateEffects } from "./state/people/person-update/person-update.effects";
import { UserRegistrationEffects } from "./state/users/user-registration/user-registration.effects";
import { UserUpdateEffects } from "./state/users/user-update/user-update.effects";
import { UsersListEffects } from "./state/users/users-list/users-list.effects";

@NgModule({
  declarations: [
    AppComponent,
    DropZoneDirective,
    ReactivelyDisabledControlDirective,
    HomeComponent,
    ImportPersonComponent,
    LoginComponent,
    NotAuthorizedComponent,
    PathNotFoundComponent,
    PeopleComponent,
    PersonComponent,
    UserRegistrationComponent,
    ResourceNotFoundComponent,
    UserOverviewComponent,
    UserSettingsComponent,
    UsersListComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,

    FlexLayoutModule,

    ReactiveComponentModule,

    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],

    EffectsModule.forRoot([AppEffects]),
    EffectsModule.forFeature([
      AuthEffects,
      UserRegistrationEffects,
      UserUpdateEffects,
      UsersListEffects,
      PersonImportEffects,
      PersonUpdateEffects,
      PeopleListEffects,
    ]),

    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: "registerWhenStable:30000",
    }),
  ],
  providers: [
    {
      provide: BASE_PATH,
      useFactory: () =>
        `https://${environment.proxy.host}:${environment.proxy.httpsPort}${environment.proxy.serverBasePath}`,
    },
    DefaultService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
