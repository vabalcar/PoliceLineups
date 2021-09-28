import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { MatSliderModule } from "@angular/material/slider";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { EffectsModule } from "@ngrx/effects";
import { ReactiveComponentModule } from "@ngrx/component";

import { environment } from "src/environments/environment";

import { AppRoutingModule } from "./routing/app-routing.module";

import { DefaultService } from "./api/api/default.service";
import { BASE_PATH } from "./api/variables";

import { AppComponent } from "./components/app.component";
import { PeopleComponent } from "./components/pages/people/people/people.component";
import { PersonComponent } from "./components/pages/people/person/person.component";
import { LoginComponent } from "./components/pages/users/login/login.component";
import { NotFoundComponent } from "./components/pages/not-found/not-found.component";
import { RegisterComponent } from "./components/pages/users/register/register.component";
import { ImportPersonComponent } from "./components/pages/people/import-person/import-person.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { UserSettingsComponent } from "./components/pages/users/user-settings/user-settings.component";
import { UsersListComponent } from "./components/pages/users/users-list/users-list.component";
import { NotAuthorizedComponent } from "./components/pages/users/not-authorized/not-authorized.component";

import { DropZoneDirective } from "./directives/drop-zone.directive";

import { reducers } from "./state/app.reducer";

import { AuthEffects } from "./state/auth/auth.effects";
import { UsersListEffects } from "./state/users-list/users-list.effects";
import { UserUpdateEffects } from "./state/user-update/user-update.effects";

@NgModule({
  declarations: [
    AppComponent,
    PeopleComponent,
    PersonComponent,
    LoginComponent,
    NotFoundComponent,
    RegisterComponent,
    ImportPersonComponent,
    HomeComponent,
    UserSettingsComponent,
    UsersListComponent,
    DropZoneDirective,
    NotAuthorizedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatSliderModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatSelectModule,

    ReactiveComponentModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forRoot(reducers),

    EffectsModule.forRoot(),
    EffectsModule.forFeature([
      AuthEffects,
      UsersListEffects,
      UserUpdateEffects,
    ]),
  ],
  providers: [
    {
      provide: BASE_PATH,
      useFactory: () => {
        const serverConfig = require("../../../config/server.json");

        const dev: boolean = serverConfig.dev;
        const serverScheme: string = dev
          ? serverConfig.schema
          : serverConfig.outSchema;
        const serverHost: string = dev
          ? serverConfig.host
          : serverConfig.outHost;
        let serverPort: string = dev ? serverConfig.port : serverConfig.outPort;
        serverPort = serverPort === "80" ? "" : `:${serverPort}`;
        const serverBasePath: string = dev
          ? serverConfig.basePath
          : serverConfig.outBasePath;
        return `${serverScheme}://${serverHost}${serverPort}${serverBasePath}`;
      },
    },
    DefaultService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
