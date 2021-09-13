import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatSliderModule } from "@angular/material/slider";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

import { AppRoutingModule } from "./app-routing.module";

import { DefaultService } from "./api/api/default.service";
import { BASE_PATH } from "./api/variables";

import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { reducers } from "./auth.reducer";

import { AppComponent } from "./app.component";
import { PeopleComponent } from "./people/people.component";
import { PersonComponent } from "./person/person.component";
import { LoginComponent } from "./login/login.component";
import { LoginFailedComponent } from "./login-failed/login-failed.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { RegisterComponent } from "./register/register.component";
import { ImportPersonComponent } from "./import-person/import-person.component";
import { HomeComponent } from "./home/home.component";
import { LogoutComponent } from "./logout/logout.component";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    PeopleComponent,
    PersonComponent,
    LoginComponent,
    LoginFailedComponent,
    NotFoundComponent,
    RegisterComponent,
    ImportPersonComponent,
    HomeComponent,
    LogoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    StoreModule.forRoot(reducers),

    !environment.production ? StoreDevtoolsModule.instrument() : [],
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
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
