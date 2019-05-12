import { Component, OnInit } from '@angular/core';
import { DefaultService } from '../api/api/default.service';
import { User } from '../api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[];

  constructor(private api: DefaultService) { }

  ngOnInit() {
    this.api.getUsers().subscribe(u => this.users = u);
  }

}
