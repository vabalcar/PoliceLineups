import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';

import { DefaultService } from './api/api/default.service';
import { BASE_PATH } from './api/variables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCardModule
  ],
  providers: [
    {provide: BASE_PATH, useFactory: () => {
      const serverConfig = require('../../../config/server.json');
      const apiConfig = require('../../../api/api.json');
      return `${apiConfig.schemes[0]}://${serverConfig.host}:${serverConfig.port}${apiConfig.basePath}`;
    }},
    DefaultService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
