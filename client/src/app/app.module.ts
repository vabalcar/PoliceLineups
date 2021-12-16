import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";

import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";

import { ReactiveComponentModule } from "@ngrx/component";
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { environment } from "src/environments/environment";

import { DefaultService } from "./api/api/default.service";
import { BASE_PATH } from "./api/variables";

import { AppComponent } from "./components/app.component";
import { LoginComponent } from "./components/pages/auth/login/login.component";
import { NotAuthorizedComponent } from "./components/pages/auth/not-authorized/not-authorized.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { PathNotFoundComponent } from "./components/pages/not-found/path-not-found/path-not-found.component";
import { ResourceNotFoundComponent } from "./components/pages/not-found/resource-not-found/resource-not-found.component";
import { ImportPersonComponent } from "./components/pages/people/import-person/import-person.component";
import { PeopleComponent } from "./components/pages/people/people/people.component";
import { PersonComponent } from "./components/pages/people/person/person.component";
import { UserRegistrationComponent } from "./components/pages/users/user-registration/user-registration.component";
import { UserSettingsComponent } from "./components/pages/users/user-settings/user-settings.component";
import { UsersListComponent } from "./components/pages/users/users-list/users-list.component";

import { DropZoneDirective } from "./directives/drop-zone.directive";

import { AppRoutingModule } from "./routing/app-routing.module";

import { reducers } from "./state/app.reducer";

import { AppEffects } from "./state/app.effects";
import { AuthEffects } from "./state/auth/auth.effects";
import { UserRegistrationEffects } from "./state/users/user-registration/user-registration.effects";
import { UserUpdateEffects } from "./state/users/user-update/user-update.effects";
import { UsersListEffects } from "./state/users/users-list/users-list.effects";

@NgModule({
  declarations: [
    AppComponent,
    DropZoneDirective,
    HomeComponent,
    ImportPersonComponent,
    LoginComponent,
    NotAuthorizedComponent,
    PathNotFoundComponent,
    PeopleComponent,
    PersonComponent,
    UserRegistrationComponent,
    ResourceNotFoundComponent,
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
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
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
