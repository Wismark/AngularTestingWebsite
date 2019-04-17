import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/services/test.service';
import { Router } from '@angular/router';
import { Results } from 'src/app/models/result';

@Component({
    selector: 'app-test-result',
    templateUrl: './test-result.component.html',
    styleUrls: ['./test-result.component.css']
})
export class TestResultComponent implements OnInit {
    resultId: number;
    info: Results = new Results();
    date: string; minutes:any;
    correctPercentage: number;
    constructor(private router: Router, private testService: TestService) { }

    ngOnInit() {
        this.resultId = localStorage.UserResultId;
        this.testService.getTestResult(this.resultId).subscribe((info) => {
            this.info = info;
            const date = new Date(info.FinishDate);
            this.date = date.toLocaleString();
            this.minutes = Math.floor(info.SpentTime/60);
            this.correctPercentage = ((info.CorrectAnswers * 100) / info.NumOfQuestions);
        });
    }

    onClickLogout() {
        localStorage.removeItem('userToken');
        this.router.navigate(['/login']);
    }

    onClickMain() {
        localStorage.removeItem('UserResultId');
        this.router.navigate(['/']);
    }
}
