import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/models/test';
import { Results } from 'src/app/models/result';
import { User } from 'src/app/models/user';
import { TestService } from '../../../services/test.service';

@Component({
  selector: 'app-main-page-admin',
  templateUrl: './main-page-admin.component.html',
  styleUrls: ['./main-page-admin.component.css']
})
export class MainPageAdminComponent implements OnInit {
  tests: Test[];
  results: Results[];
  users: User[];

  testEditSelect: number;
  userResult: number;
  userTest: number;
  userForRole: number;

  constructor(private testService: TestService) { }

  ngOnInit() {
    this.testService.getTests().subscribe(tests => {
      this.tests = tests;
    });

    this.results = [
    {Id: 1, TestName: 'Math', UserName: 'Vasya', NumOfQuestions: 30, FinishDate: new Date('12.15.1999 15:30') },
    {Id: 2, TestName: 'Music', UserName: 'Petya', NumOfQuestions: 20, FinishDate: new Date('09.28.1999 19:30') }
    ];

    this.users = [
      {Id: 1, FirstName: 'Jonh', LastName: 'Doe', Role: 'admin'},
      {Id: 2, FirstName: 'Mikel', LastName: 'Karol', Role: 'user'},
      {Id: 3, FirstName: 'Alex', LastName: 'Lovarinsky', Role: 'superadmin'}
    ];

    this.testEditSelect = 0;
    this.userResult = 0;
    this.userTest = 0;
    this.userForRole = 0;
  }

}
