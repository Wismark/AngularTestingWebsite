import { Component, OnInit } from '@angular/core';
import { Answer } from 'src/app/models/answer';
import { ImageInfo } from 'src/app/models/ImageInfo';
import { TestService } from 'src/app/services/test.service';
import { QuestionInfo } from 'src/app/models/QuestionInfo';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserAnswer } from 'src/app/models/userAnswer';
import { timer } from 'rxjs';
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
    userAnswer: UserAnswer;
    userAnswers: UserAnswer [] = []; //localStorage.TestInUseTime
    
    constructor(private testService: TestService, private router: Router, private _DomSanitizationService: DomSanitizer,  private toastr: ToastrService) 
    { 
        this.timer=localStorage.TestInUseTime;
        this.startTimer(); 
    }

    interval; // clearInterval(this.interval);

    startTimer() {
        this.interval = setInterval(() => {
        if(this.timer > 0) {
            this.timer--;
            console.log(this.timer);
        } else {
            this.toastr.toastrConfig.timeOut=2000;
            this.toastr.info('Time is up! Let\'s see results..');
            this.finishTest();
        }
        },1000)
    }

    ngOnInit() {
        if( localStorage.CurrentIndex === undefined) { 
            localStorage.CurrentIndex = 0;
        }

        this.numOfQuestuions = localStorage.TestInUseCount;

        if(localStorage.UserAnswers !== undefined) {
            this.userAnswers = JSON.parse(localStorage.UserAnswers);
            if( localStorage.UserAnswers[localStorage.CurrentIndex] !== undefined) {
         //       console.log(localStorage.UserAnswers[localStorage.CurrentIndex]);
                this.userAnswer = this.userAnswers[localStorage.CurrentIndex];

            }             
        //    console.log(this.userAnswer + ' ' +localStorage.CurrentIndex );
        }

         if(this.userAnswer === undefined) {
            this.userAnswer = new UserAnswer();
            if(this.userAnswer.Answers === undefined) {
                this.userAnswer.Answers = [];
                for(let i=0; i<this.answersInfo.length; i++) {
                    this.userAnswer.Answers.push(false);
                }
                this.userAnswer.QuestionIndex = localStorage.CurrentIndex;
            }
        }

        this.testService.getCurrentQuestionID(localStorage.CurrentIndex, localStorage.TestInUseId).subscribe((id:number) => {
            if(id>0){
                this.questionID = id;
                this.questionNumber = localStorage.CurrentIndex;
                this.questionNumber++;
                this.getQuestionInfo();
            }
            return; 
        })

    }

    getQuestionInfo() {
            this.testService.getQuestionInfoById(this.questionID).subscribe( (info) => {
            this.info = info;
 //           console.log(info);	
        });

        this.testService.getQuestionAnswersById(this.questionID).subscribe( (answers) => {
            this.answersInfo = answers;      
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
            this.clearStorage();
            this.router.navigate(['/']);
        } 
    }

    clearStorage() {
        localStorage.removeItem('TestInUseId');
        localStorage.removeItem('CurrentIndex');
        localStorage.removeItem('TestInUseCount');
        localStorage.removeItem('TestInUseTime');
        localStorage.removeItem('UserAnswers');
    }

    finishTestclick() {
        if (confirm('Are you sure you want to finish test?')) {
            this.finishTest();
            //this.router.navigate(['/results']);
        }    
       
    }

    finishTest() {
        this.updateAnswers();
        this.userAnswers = JSON.parse(localStorage.UserAnswers);
        console.log(localStorage.userId); 
        this.checkAnswers();
        this.testService.checkUsersTestResult(this.timer,this.userAnswers, localStorage.userId, localStorage.TestInUseId).subscribe((resultId) => {
            localStorage.UserResultId = resultId;
            this.clearStorage();
            this.router.navigate(['/results']);
        });
    }

    previousQclick() {
        this.updateAnswers();
        if(localStorage.CurrentIndex > 0) {
        localStorage.CurrentIndex--;
        this.ngOnInit();
       } else {
           this.toastr.info('It\'s a first question!');
       }
    }

    firstQclick() {
        this.updateAnswers();
        localStorage.CurrentIndex = 0;
        this.ngOnInit();
    }

    lastQclick() {
        this.updateAnswers();
        localStorage.CurrentIndex = this.numOfQuestuions-1;
        this.ngOnInit();
    }

    nextQclick() {
        this.updateAnswers();
        if(localStorage.CurrentIndex < this.numOfQuestuions-1) {
        localStorage.CurrentIndex++;
        this.ngOnInit();
       } else {
           this.toastr.info('No more questions left!');
       }
    }

    onAnswerChange(index) {
        if(this.info.QuestionType === 'radio') {
            this.userAnswer.Answers.forEach(a => a = false); //this.answers.forEach( a => a.Correct = false)
			this.userAnswer.Answers[index] = true;
        } else {
            if(this.userAnswer.Answers[index]) {
                this.userAnswer.Answers[index] = false;
            } else { 
                 this.userAnswer.Answers[index] = true;
            }
        }
    //    console.log(this.userAnswer);
    }

    updateAnswers() {
        if ( this.userAnswers !== undefined && this.userAnswers[localStorage.CurrentIndex] !== undefined) {
            this.userAnswers[localStorage.CurrentIndex] = this.userAnswer;
        } else {
            if (this.userAnswer === undefined) {
            this.userAnswer= new UserAnswer();
            }
            this.userAnswer.QuestionIndex = localStorage.CurrentIndex;
            this.userAnswers.push(this.userAnswer);
        }
        
        localStorage.setItem('UserAnswers', JSON.stringify(this.userAnswers));
    }

    //this.userAnswers = JSON.parse(localStorage.UserAnswers);

    checkAnswers() {
            this.userAnswers.forEach(a=> {
            console.log('qIndex=' + a.QuestionIndex);
            a.Answers.forEach( (e,i) => {
                if(e===null) e=false;
                console.log(i + ' : ' + e)
                });
            console.log('----');
        })
    }
}



