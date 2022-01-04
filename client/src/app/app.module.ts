import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
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
import { MatStepperModule } from "@angular/material/stepper";
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
import { HttpRequestInterceptor } from "./communication/httpInterceptor";
import { AppComponent } from "./components/app/app.component";
import { FilterChipListComponent } from "./components/lineups/filter-chip-list/filter-chip-list.component";
import { FullNameSelectorComponent } from "./components/selectors/full-name-selector/full-name-selector.component";
import { AgeSelectorComponent } from "./components/selectors/people/age-selector/age-selector.component";
import { BirthDateSelectorComponent } from "./components/selectors/people/birth-date-selector/birth-date-selector.component";
import { NationalitySelectorComponent } from "./components/selectors/people/nationality-selector/nationality-selector.component";
import { PhotoSelectorComponent } from "./components/selectors/people/photo-selector/photo-selector.component";
import { EmailSelectorComponent } from "./components/selectors/users/email-selector/email-selector.component";
import { NewPasswordSelectorComponent } from "./components/selectors/users/new-password-selector/new-password-selector.component";
import { UsernameSelectorComponent } from "./components/selectors/users/username-selector/username-selector.component";
import { DropZoneDirective } from "./directives/drop-zone.directive";
import { FileUploadDirective } from "./directives/file-upload.directive";
import { ReactivelyDisabledControlDirective } from "./directives/reactively-disabled-control.directive";
import { LoginComponent } from "./pages/auth/login/login.component";
import { NotAuthorizedComponent } from "./pages/auth/not-authorized/not-authorized.component";
import { HomeComponent } from "./pages/home/home.component";
import { AllLineupsListComponent } from "./pages/lineups/all-lineups-list/all-lineups-list.component";
import { CurrentUserLineupsListComponent } from "./pages/lineups/current-user-lineups-list/current-user-lineups-list.component";
import { LineupEditorComponent } from "./pages/lineups/lineup-editor/lineup-editor.component";
import { PathNotFoundComponent } from "./pages/not-found/path-not-found/path-not-found.component";
import { ResourceNotFoundComponent } from "./pages/not-found/resource-not-found/resource-not-found.component";
import { PeopleListComponent } from "./pages/people/people-list/people-list.component";
import { PersonEditComponent } from "./pages/people/person-edit/person-edit.component";
import { PersonImportComponent } from "./pages/people/person-import/person-import.component";
import { PersonOverviewComponent } from "./pages/people/person-overview/person-overview.component";
import { UserOverviewComponent } from "./pages/users/user-overview/user-overview.component";
import { UserRegistrationComponent } from "./pages/users/user-registration/user-registration.component";
import { UserSettingsComponent } from "./pages/users/user-settings/user-settings.component";
import { UsersListComponent } from "./pages/users/users-list/users-list.component";
import { AppRoutingModule } from "./routing/app-routing.module";
import { BlobsService } from "./services/blobs/blobs.service";
import { NotificationsService } from "./services/notifications/notifications.service";
import { AppEffects } from "./state/app.effects";
import { reducers } from "./state/app.reducer";
import { AuthEffects } from "./state/auth/auth.effects";
import { LineupUpdateEffects } from "./state/lineups/lineup-update/lineup-update.effects";
import { LineupsListEffects } from "./state/lineups/lineups-list/lineups-list.effects";
import { PeopleListEffects } from "./state/people/people-list/people-list.effects";
import { PersonImportEffects } from "./state/people/person-import/person-import.effects";
import { PersonUpdateEffects } from "./state/people/person-update/person-update.effects";
import { UserRegistrationEffects } from "./state/users/user-registration/user-registration.effects";
import { UserUpdateEffects } from "./state/users/user-update/user-update.effects";
import { UsersListEffects } from "./state/users/users-list/users-list.effects";

@NgModule({
  declarations: [
    DropZoneDirective,
    FileUploadDirective,
    ReactivelyDisabledControlDirective,

    AppComponent,

    FilterChipListComponent,

    UsernameSelectorComponent,
    FullNameSelectorComponent,
    NewPasswordSelectorComponent,
    EmailSelectorComponent,
    PhotoSelectorComponent,
    BirthDateSelectorComponent,
    NationalitySelectorComponent,
    AgeSelectorComponent,

    HomeComponent,

    LoginComponent,
    NotAuthorizedComponent,

    PathNotFoundComponent,
    ResourceNotFoundComponent,

    UsersListComponent,
    UserRegistrationComponent,
    UserOverviewComponent,
    UserSettingsComponent,

    PeopleListComponent,
    PersonImportComponent,
    PersonOverviewComponent,
    PersonEditComponent,

    LineupEditorComponent,
    CurrentUserLineupsListComponent,
    AllLineupsListComponent,
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
    MatChipsModule,
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
    MatStepperModule,
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
      LineupUpdateEffects,
      LineupsListEffects,
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    },

    DefaultService,

    BlobsService,
    NotificationsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
