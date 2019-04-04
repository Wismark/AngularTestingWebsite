import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/models/area';
import { Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { Test } from 'src/app/models/test';
import { element } from '@angular/core/src/render3';
import { Question } from 'src/app/models/questionModel';

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent implements OnInit {
  areas: Area [];
  removeAreaIndexs: number [] = [];
  testInfo: Test = new Test();
  questions: Question[];
  active = false;
  Title = 'Test view';
  constructor(private router: Router,  private testService: TestService) { }

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

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  RemoveAreasClick() {
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
}
