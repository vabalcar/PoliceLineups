import { Component, Inject } from '@angular/core';
import { BASE_PATH } from './api/variables';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  constructor(@Inject(BASE_PATH) public backend: String) {}
}
