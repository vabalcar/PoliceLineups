import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DefaultService } from './api/api/default.service';
import { BASE_PATH } from './api/variables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { PeopleComponent } from './people/people.component';
import { PersonComponent } from './person/person.component';


@NgModule({
  declarations: [
    AppComponent,
    PeopleComponent,
    PersonComponent
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
    MatIconModule
  ],
  providers: [
    { provide: BASE_PATH, useFactory: () => {
      const apiConfig = require('../../../api/api.json');
      const serverConfig = require('../../../config/server.json');

      const dev : boolean = serverConfig.dev;
      const serverScheme : string = dev ? 'http' : apiConfig.schemes[0];
      const serverHost : string = dev ? serverConfig.host : serverConfig.outHost;
      let serverPort : string = dev ? serverConfig.port : serverConfig.outPort;
      serverPort = serverPort == '80' ? '' : `:${serverPort}`;
      const serverBasePath : string = dev ? '' : serverConfig.outBasePath;
      return `${serverScheme}://${serverHost}${serverPort}${serverBasePath}${apiConfig.basePath}`;
    }},
    DefaultService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
