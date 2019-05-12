import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';

import { DefaultService } from './api/api/default.service';
import { BASE_PATH } from './api/variables';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: BASE_PATH, useFactory: () => {
      const serverConfig = require('../../../config/server.json');
      return `http://localhost:${serverConfig.port}/v1`;
    }},
    DefaultService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
