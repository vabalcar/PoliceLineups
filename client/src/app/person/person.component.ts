import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DefaultService } from '../api/api/default.service';
import { Person } from '../api'

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  person: Person;

  constructor(private route: ActivatedRoute, private api: DefaultService) {
    this.person = {} as Person
  }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.api.getPerson(id).subscribe(p => this.person = p)
  }

}
