import { Component, OnInit } from '@angular/core';
import { TestService } from 'src/app/services/test.service';
import { Router } from '@angular/router';
import { Results } from 'src/app/models/result';
import { ResultByArea } from 'src/app/models/resultByArea';

@Component({
    selector: 'app-test-result',
    templateUrl: './test-result.component.html',
    styleUrls: ['./test-result.component.css']
})
export class TestResultComponent implements OnInit {
    resultId: number;
    info: Results = new Results();
    areaResults: ResultByArea [] = [];
    date: string; minutes: any;
    correctPercentage: number;

    constructor(private router: Router, private testService: TestService) { }

    ngOnInit() {
        this.resultId = localStorage.UserResultId;
        if (this.resultId < 1) {
            return this.router.navigate(['/forbidden']);
        }

        this.testService.getTestResult(this.resultId).subscribe((info) => {
            this.info = info;
            const date = new Date(info.FinishDate);
            this.date = date.toLocaleString();
            this.minutes = Math.floor(info.SpentTime / 60);
            this.correctPercentage = ((info.CorrectAnswers * 100) / info.NumOfQuestions);
        });

        this.testService.getResultsInArea(this.resultId).subscribe( (results) => {
            this.areaResults = results;
        });
    }

    onClickLogout() {
        localStorage.removeItem('userToken');
        this.router.navigate(['/login']);
    }

    onClickMain() {
        localStorage.removeItem('UserResultId');
        if (localStorage.userRole.includes('Admin') || localStorage.userRole.includes('SuperAdmin')) {
            return this.router.navigate(['/admin']);
        }
        return this.router.navigate(['/']);
    }
}
