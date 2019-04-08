import { Component, OnInit, ViewChild } from '@angular/core';
import { Area } from 'src/app/models/area';
import { TestService } from 'src/app/services/test.service';
import { ToastrService } from 'ngx-toastr';
import { Answer } from 'src/app/models/answer';
import { Router } from '@angular/router';
import { QuestionInfo } from 'src/app/models/QuestionInfo';

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
  info: QuestionInfo = new QuestionInfo();
  Qtype = 'radio';

  constructor(private router: Router, private testService: TestService, private toastr: ToastrService) { }

ngOnInit() {
    this.info.Text = 'Hello there! 2+2 is what?';
    this.info.AreaId = -1;
    this.info.Id = -1;
    this.info.TestId = localStorage.ViewTestId;
    this.testService.getTestAreaById(localStorage.ViewTestId).subscribe( (areas) => {
    this.testAreas = areas;
    this.areaSelect = 0;
    });
    this.answers =  [{Text: 'Default', Correct: false }];
}

Logout() {
  localStorage.removeItem('userToken');
  this.router.navigate(['/login']);
}

qTypeChange(type: number) {
  if ( type === 1) {
    this.Qtype = 'radio';
  }
  if ( type === 2) {
    this.Qtype = 'check';
  }
  this.answers.forEach( e => e.Correct = false);
}

addAnswerClick() {
  const asw = new Answer();
  asw.Text = 'Default';
  asw.Correct = false;
  this.answers.push(asw);
}

onChangeCorrect(index: number) {
  if (this.Qtype === 'radio') {
    this.answers.forEach( e => e.Correct = false);
    this.answers[index].Correct = true;
  } else {
    this.answers[index].Correct = true;
  }
}

onDeleteAnswers(index: number) {
  if (this.removeAnswersIndexs.includes(index)) {
    this.removeAnswersIndexs.splice(this.removeAnswersIndexs.indexOf(index), 1);
  } else {
    this.removeAnswersIndexs.push( index );
  }
}

removeAnswersClick() {
  const temp = [];
  for (let i = 0; i < this.answers.length; i++) {
    if (!this.removeAnswersIndexs.includes(i)) {
      temp.push(this.answers[i]);
    }
  }
  this.removeAnswersIndexs = [];
  this.answers = temp;
}


onFileAdded($event) {
  console.log('Loader!');
  let files = $event.target.files;
  console.log(files);
  if (files !== undefined) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (files[i].type === 'image/jpeg' || files[i].type === 'image/png') {
        this.images.push(files[i]);
        this.Files += files[i].name + '; ';
      } else {
        this.toastr.info('Files should be images 50x50px or 200x200px..');
        this.toastr.error('Inappropriate file!');
      }
    }
    console.log('Images:' + this.images);
  }
  this.images.forEach(img => {
    this.viewImages(img);
    this.imagesUrl = [];
  });
  $event.target.value = null;
}

viewImages(img) {
  const self = this;
  let reader = new FileReader();
  reader.onload = (e) => {
  self.imagesUrl.push((e.target as FileReader).result);
  reader = new FileReader();
};
  reader.readAsDataURL(img);
}

updateImagesText() {
  this.Files = '';
  this.images.forEach(img => {
    this.Files += img.name + '; ';
  });
}

removeImage(index: number) {
  this.images.splice(this.images.indexOf(this.images[index]), 1);
  this.imagesUrl.splice(this.imagesUrl.indexOf(this.imagesUrl[index]), 1);
  this.updateImagesText();
}

uploadClick() {
  if (this.questionExists) {

  } else {
    this.toastr.info('Question is new. Save question first!');
  }
}

checkAnswers() {
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

doneQclick() {
  if (this.areaSelect === undefined) {
    return this.toastr.info('Please select test area for the question');
  }

  if (!this.checkAnswers()) {
    return this.toastr.info('Should be at least 2 answers and one correct option');
  }

  if (this.Qtype === undefined) {
    return this.toastr.info('Please select question type');
  }

  if (this.questionExists) {

  }


  this.info.QuestionType = this.Qtype;
  this.info.AreaId = this.testAreas[this.areaSelect].TestAreaId;
  this.testService.addNewTestQuestion(this.info).subscribe( (questionId: any) => {
    console.log(questionId);
    this.questionExists = true;
    this.testService.addAnswersToQuestion(questionId, this.answers).subscribe ( (success) => {
    });

    
    this.toastr.success('Question was created succesfully!');
  });

}

cancelQclick() {
  this.ngOnInit();
}

nextQclick() {
  window.URL.createObjectURL(this.images[0]);
  this.router.navigate(['/question-view']);
}

lastQclick() {
  this.router.navigate(['/question-view']);
}

previousQclick() {
  this.router.navigate(['/question-view']);
}

firstQclick() {
  this.router.navigate(['/question-view']);
}

}
