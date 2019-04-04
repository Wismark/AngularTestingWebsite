import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/models/test';
import { TestService } from '../../services/test.service';
import { Results } from 'src/app/models/result';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  tests: Test[];
  results: Results[];
  userid: string;

  resultSelect: number;
  testSelect: number;

  constructor(private testService: TestService, private router: Router) {
    console.log(testService.getTests());
  }

  ngOnInit() {
      this.userid = '1';
      this.testService.getTests().subscribe(tests => {
      this.tests = tests;
    });

      this.testService.getTestResultsByUserId(this.userid).subscribe(resul => {
      this.results = resul;
    });

      this.resultSelect = 0;
      this.testSelect = 0;
  }

  ResultSelect() {
    console.log('123');
    if (this.resultSelect > 0) {

    }
  }

  TestSelect() {
    console.log('123');
    if (this.testSelect > 0) {
      console.log( this.tests[this.testSelect - 1].Name );
    }
  }

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

}
