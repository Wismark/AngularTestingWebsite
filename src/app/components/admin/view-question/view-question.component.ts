import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/models/area';
import { TestService } from 'src/app/services/test.service';
import { NewQuestionInfo } from 'src/app/models/newQuestionModel';
import { ToastrService } from 'ngx-toastr';
import { Answer } from 'src/app/models/answer';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'app-view-question',
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.css']
})
export class ViewQuestionComponent implements OnInit {
  questionExists = false;
  title = 'Question view'; Files = '';
  testAreas: Area [] = [];
  answers: Answer [] = [];
  areaSelect: number;
  removeAnswersIndexs: number [] = [];
  images: File [] = [];
  imagesUrl: any [] = [];
  info: NewQuestionInfo = new NewQuestionInfo();

  constructor( private testService: TestService, private toastr: ToastrService) { }

  ngOnInit() {
      this.info.Text = 'Hello there! 2+2 is what?';
      this.info.AreaId = -1;
      this.testService.getTestAreaById(localStorage.ViewTestId).subscribe( (areas) => {
      this.testAreas = areas;
      this.areaSelect = 0;
      });
      this.answers =  [{Text: 'Default', Correct: false }];
  }

  QTypeChange(type: number) {
    if ( type === 1) {
      this.info.QuestionType = 'radio';
    }
    if ( type === 2) {
      this.info.QuestionType = 'check';
    }
  }

  AddAnswerClick() {
    const asw = new Answer();
    asw.Text = 'Default';
    asw.Correct = false;
    this.answers.push(asw);
  }

  onChangeCorrect(index: number) {
      this.answers.forEach( e => e.Correct = false);
      this.answers[index].Correct = true;
  }

  OnDeleteAnswers(index: number) {
    if (this.removeAnswersIndexs.includes(index)) {
      this.removeAnswersIndexs.splice(this.removeAnswersIndexs.indexOf(index), 1);
    } else {
      this.removeAnswersIndexs.push( index );
    }
  }

  RemoveAnswersClick() {
    const temp =  [];
    for (let i = 0; i < this.answers.length; i++) {
       if (!this.removeAnswersIndexs.includes(i)) {
         temp.push(this.answers[i]);
       }
    }
    this.removeAnswersIndexs = [];
    this.answers =  temp;
  }

  onFileAdded($event) {
    console.log('Loader!')
    let files = $event.target.files;
    console.log($event.target.files );
    if (files !== undefined) {
// tslint:disable-next-line: prefer-for-of
       for (let i = 0; i < files.length; i++) {
                if ( files[i].type === 'image/jpeg' || files[i].type === 'image/png' ) {
                  this.images.push(files[i]);
                  this.Files += files[i].name + '; ';
                  console.log(files[i]);
            } else {
              this.toastr.info('Files should be images 50x50px or 200x200px..');
              this.toastr.error('Inappropriate file!');
            }
        }
       console.log(this.images);
       this.images.forEach(image => {
       let reader = new FileReader();
       reader.readAsDataURL(image);
       reader.onload = (event) => {
        // console.log(reader.result);
         this.imagesUrl.push(reader.result);
          };
      });
    }
  }

  UpdateImagesText() {
    this.Files = '';
    this.images.forEach(img => {
      this.Files += img.name + '; ';
    });
  }

  RemoveImage(index: number) {
    this.images.splice(this.images.indexOf(this.images[index]), 1);
    this.imagesUrl.splice(this.imagesUrl.indexOf(this.imagesUrl[index]), 1);
    this.UpdateImagesText();
  }

  UploadClick() {
    if (this.questionExists) {

    } else {
      this.toastr.info('Question is new. Save question first!');
    }
  }

  CheckAnswers() {
    let correct = false;
    if ( this.answers.length > 1 ) {
      this.answers.forEach( a => {
        if ( a.Correct ) {
          correct = true;
         }
      });
    }
    return correct;
  }
// Navigation

DoneQclick() {
    if ( this.areaSelect === undefined) {
     this.toastr.info('Please select test area for the question');
    } else {
      if ( this.CheckAnswers() ) {
        if( this.info.QuestionType !== undefined) {
          this.info.AreaId = this.testAreas[this.areaSelect].TestAreaId;
          console.log(this.testAreas[this.areaSelect].TestAreaId);
          this.questionExists = true;
        } else {
          this.toastr.info('Please select question type');
        }
      } else {
        this.toastr.info('Should be at least 2 answers and one correct option');
      }
    }
  }

  CancelQclick() {
    this.ngOnInit();
  }

  NextQclick() {

  }

  LastQclick() {

  }

  PreviousQclick() {

  }

}
