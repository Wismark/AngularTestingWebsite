import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/models/test';
import { TestService } from '../../services/test.service';
import { Results } from 'src/app/models/result';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { UserAnswer } from 'src/app/models/userAnswer';

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
    testIdSelect: string;

    constructor(private testService: TestService, private router: Router, private _DomSanitizationService: DomSanitizer) {
    }

    ngOnInit() {
        this.clearLocalStorage();
        this.userid = localStorage.userId;
        this.testService.getTests(true).subscribe(tests => {
            this.tests = tests;
        });

        this.testService.getTestResultsByUserId(this.userid).subscribe(results => {
            this.results = results;
        });

        this.resultSelect = 0;
        this.testIdSelect = '0';
    }

    resultSelectClick(index) {
        console.log('id=' + this.resultSelect);
        if (this.resultSelect > 0) {
            this.clearLocalStorage();
            localStorage.UserResultId = this.resultSelect;
            this.router.navigate(['/results']);
        }
    }

    testSelectClick() {
        if (parseInt(this.testIdSelect, 10) > 0) {
            //  console.log( this.tests[this.testIdSelect - 1].Name );
            localStorage.TestInUseId = this.testIdSelect;
            const index = this.tests.findIndex((test) => test.TestId === parseInt(this.testIdSelect, 10));
            // console.log('index=' + index);
            localStorage.CurrentIndex = 0;
            const count = this.tests[index].NumOfQuestions;
            localStorage.TestInUseCount = count;
            localStorage.TestInUseTime = this.tests[index].TimeLimitation * 60;
            this.router.navigate(['/test']);
        }
    }

    logout() {
        localStorage.removeItem('userToken');
        this.router.navigate(['/login']);
    }

    clearLocalStorage() {
        localStorage.removeItem('TestInUseId');
        localStorage.removeItem('CurrentIndex');
        localStorage.removeItem('TestInUseCount');
        localStorage.removeItem('TestInUseTime');
        localStorage.removeItem('UserAnswers');
        localStorage.removeItem('UserResultId');
    }
}
