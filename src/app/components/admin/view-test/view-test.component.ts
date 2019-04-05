import { Component, OnInit, Input } from '@angular/core';
import { Area } from 'src/app/models/area';
import { Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { Test } from 'src/app/models/test';
import { element } from '@angular/core/src/render3';
import { QuestionInfo } from 'src/app/models/QuestionInfo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent implements OnInit {
  unsaved = false;
  areas: Area [];
  removeAreaIndexs: number [] = [];
  removeQuestionsIndexs: number [] = [];
  testInfo: Test = new Test();
  questions: QuestionInfo[];
  active = false;
  Title = 'Test view';
  constructor(private router: Router,  private testService: TestService, private toastr: ToastrService) { }

  ngOnInit() {
    this.testService.getTestInfoById(localStorage.ViewTestId).subscribe( (test) => {
    this.testInfo = test;
    });

    this.testService.getTestAreaById(localStorage.ViewTestId).subscribe( (areas) => {
    this.areas = areas;
    });

    this.testService.getTestQuestionsById(localStorage.ViewTestId).subscribe( (questions) => {
    this.questions = questions;
    });
  }

  OnDeleteAreas(index: number) {
    if (this.removeAreaIndexs.includes(index)) {
      this.removeAreaIndexs.splice(this.removeAreaIndexs.indexOf(index), 1);
    } else {
      this.removeAreaIndexs.push( index );
    }
  }

  OnDeleteQuestions(index: number) {
    if (this.removeQuestionsIndexs.includes(index)) {
      this.removeQuestionsIndexs.splice(this.removeQuestionsIndexs.indexOf(index), 1);
    } else {
      this.removeQuestionsIndexs.push( index );
    }
  }

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  StateChange() {
    this.unsaved = true;
  }

  RemoveAreasClick() {
    this.StateChange();
    const temp =  [];
    for (let i = 0; i < this.areas.length; i++) {
       if (!this.removeAreaIndexs.includes(i)){
         temp.push(this.areas[i]);
       }
    }
    this.removeAreaIndexs = [];
    this.areas =  temp;
  }

  AddAreaClick() {
    const area = new Area();
    area.AreaName = 'Undefined area';
    area.TestAreaId = -1;
    this.areas.push(area);
  }

  RemoveQuestionClick() {
    this.StateChange();
    const temp =  [];
    for (let i = 0; i < this.questions.length; i++) {
       if (!this.removeQuestionsIndexs.includes(i)){
         temp.push(this.questions[i]);
       }
    }
    this.removeQuestionsIndexs = [];
    this.areas =  temp;
  }

  AddNewQuestionClick() {
    if (this.unsaved) {
        if (confirm('There\'s unsaved changes, would you like to save them?')) {
          this.SaveChanges();
        } else {
        this.router.navigate(['/question-view']);
      }
    }
    this.router.navigate(['/question-view']);
  }

  SaveChanges() {
    // ...
    this.toastr.success('Changes successfully saved');
    this.unsaved = false;
  }
}
