import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/models/test';
import { Results } from 'src/app/models/result';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  tests: Test[];
  results: Results[];

  resultSelect: number;
  testSelect: number;

  constructor(private testService: TestService) {
    console.log(testService.getTests());
  }

  ngOnInit() {
    this.testService.getTests().subscribe(tests => {
      this.tests = tests;
    });

    this.results = [
    {Id: 1, Name: 'Math', UserName: 'Vasya', NumOfQuestions: 30, FinishDate: new Date('12.15.1999 15:30') },
    {Id: 2, Name: 'Music', UserName: 'Petya', NumOfQuestions: 20, FinishDate: new Date('09.28.1999 19:30') }
  ];

    this.resultSelect = 0;
    this.testSelect = 0;
  }

  ResultSelect() {
    console.log("123");
    if (this.resultSelect > 0) {
      console.log( this.results[this.resultSelect - 1].Name );
    }
  }

  TestSelect() {
    console.log("123");
    if (this.testSelect > 0) {
      console.log( this.tests[this.testSelect - 1].Name );
    }
  }

}
