import { Component, OnInit, Input } from '@angular/core';
import { Area } from 'src/app/models/area';
import { Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { Test } from 'src/app/models/test';
import { element } from '@angular/core/src/render3';
import { QuestionInfo } from 'src/app/models/QuestionInfo';
import { ToastrService } from 'ngx-toastr';
/* tslint:disable */
@Component({
	selector: 'app-view-test',
	templateUrl: './view-test.component.html',
	styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent implements OnInit {
	unsaved = false;
	areas: Area[];
	removeAreaIndexs: number[] = [];
	removeQuestionsIndexs: number[] = [];
	testInfo: Test = new Test();
	questions: QuestionInfo[];
	oldTest: Test[] = [];
	active = false;
	Title = 'Test view';
	constructor(private router: Router, private testService: TestService, private toastr: ToastrService) { }

	ngOnInit() {
		this.testService.getTestInfoById(localStorage.ViewTestId).subscribe((test) => {
			this.testInfo = test;
		});

		this.testService.getTestAreaById(localStorage.ViewTestId).subscribe((areas) => {
			this.areas = areas;
		});

		this.testService.getTestQuestionsById(localStorage.ViewTestId).subscribe((questions) => {
			this.questions = questions;
		});
	}

	onDeleteAreas(index: number) {
		if (this.removeAreaIndexs.includes(index)) {
			this.removeAreaIndexs.splice(this.removeAreaIndexs.indexOf(index), 1);
		} else {
			this.removeAreaIndexs.push(index);
		}
	}

	onDeleteQuestions(index: number) {
		if (this.removeQuestionsIndexs.includes(index)) {
			this.removeQuestionsIndexs.splice(this.removeQuestionsIndexs.indexOf(index), 1);
		} else {
			this.removeQuestionsIndexs.push(index);
		}
	}

	logout() {
		localStorage.removeItem('userToken');
		this.router.navigate(['/login']);
	}

	stateChange() {
		this.unsaved = true;
	}

	semoveAreasClick() {
		this.stateChange();
		const temp = [];
		for (let i = 0; i < this.areas.length; i++) {
			if (!this.removeAreaIndexs.includes(i)) {
				temp.push(this.areas[i]);
			}
		}
		this.removeAreaIndexs = [];
		this.areas = temp;
	}

	sddAreaClick() {
		const area = new Area();
		area.AreaName = 'Undefined area';
		area.TestAreaId = -1;
		this.areas.push(area);
	}

	removeQuestionClick() {
		this.stateChange();
		console.log
		const temp = [];
		for (let i = 0; i < this.questions.length; i++) {
			if (!this.removeQuestionsIndexs.includes(i)) {
				temp.push(this.questions[i]);
			}
		}
		this.removeQuestionsIndexs = [];
		this.questions = temp;
		console.log(this.questions);
	}

	addNewQuestionClick() {
		if (this.unsaved) {
			if (confirm('There\'s unsaved changes, would you like to save them?')) {
				this.saveChanges();
			} else {
				this.router.navigate(['/question-view']);
			}
		}
		this.router.navigate(['/question-view']);
	}

	saveChanges() {
		// ...
		this.testService.updateQuestions(this.testInfo.TestId, this.questions).subscribe(() => {
			this.toastr.success('Changes successfully saved');
		});
		this.unsaved = false;
	}

	cancelChanges(){
		this.unsaved = false;
		this.ngOnInit();
	}

	editQuestion(index) {
		localStorage.ViewQuestionId = this.questions[index].QuestionId;
		localStorage.QuestionIndex = index;
		localStorage.setItem("Questions", JSON.stringify(this.questions));
		console.log('index='+localStorage.QuestionIndex);
		this.router.navigate(['/question-view']);
	}
}
