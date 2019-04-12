import { Component, OnInit } from '@angular/core';
import { Answer } from 'src/app/models/answer';
import { ImageInfo } from 'src/app/models/ImageInfo';
import { TestService } from 'src/app/services/test.service';
import { QuestionInfo } from 'src/app/models/QuestionInfo';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
/* tslint:disable */
@Component({
  selector: 'app-test-process',
  templateUrl: './test-process.component.html',
  styleUrls: ['./test-process.component.css']
})
export class TestProcessComponent implements OnInit {
    imagesUrl: any[] = [];
    imagesInfos: ImageInfo[] = [];
    answersInfo: Answer[] = [];
    questionID: number;
    info: QuestionInfo = new QuestionInfo();
    questionNumber:number;
    timer:any;
    numOfQuestuions:number;

    constructor(private testService: TestService, private router: Router, private _DomSanitizationService: DomSanitizer,  private toastr: ToastrService) { }

    ngOnInit() {
        if( localStorage.CurrentIndex === undefined) { 
            localStorage.CurrentIndex = 0;
        }

        this.numOfQuestuions = localStorage.TestInUseCount;
        this.timer = localStorage.TestInUseTime;

     //   console.log(localStorage.CurrentIndex);

        this.testService.getCurrentQuestionID(localStorage.CurrentIndex, localStorage.TestInUseId).subscribe((id:number) => {
   //         console.log(id);
            this.questionID = id;
            this.questionNumber = localStorage.CurrentIndex;
            this.questionNumber++;
            this.getQuestionInfo();
        })
    }

    getQuestionInfo() {
    this.testService.getQuestionInfoById(this.questionID).subscribe( (info) => {
            this.info = info;
 //           console.log(info);	
        });

        this.testService.getQuestionAnswersById(this.questionID).subscribe( (answers) => {
            this.answersInfo = answers;
//          console.log(answers);
        });

        this.testService.getQuestionImages(this.questionID).subscribe( (imageInfo) => {
                this.imagesInfos = imageInfo;
                this.imagesUrl = [];
                this.imagesInfos.forEach( (info) => {
                    this.imagesUrl.push(info.ImageUrl);
                })
 //          console.log(this.imagesUrl[0]);
        });
    }

    logout() {
        localStorage.removeItem('userToken');
		this.router.navigate(['/login']);
    }

    goBack() {
        if (confirm('Are you sure you want to terminate test?')) {
            localStorage.removeItem('TestInUseId');
            localStorage.removeItem('CurrentIndex');
            localStorage.removeItem('TestInUseCount');
            localStorage.removeItem('TestInUseTime');
            this.router.navigate(['/']);
        } 
    }

    finishTestclick() {

    }

    previousQclick() {
        if(this.questionNumber > 0) {
        localStorage.CurrentIndex = this.questionNumber-1;
        console.log(localStorage.CurrentIndex);
        this.ngOnInit();
       } else {
           this.toastr.info('It\'s a first question!');
       }
    }

    firstQclick() {

    }

    lastQclick() {

    }

    nextQclick() {
        if(this.questionNumber < this.numOfQuestuions) {
        
        localStorage.CurrentIndex = this.questionNumber+1;
        this.ngOnInit();
       } else {
           this.toastr.info('No more questions left!');
       }
    }

    onAnswerChange(index) {

    }
}


