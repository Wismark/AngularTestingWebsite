import { Component, OnInit, Input } from '@angular/core';
import { Area } from 'src/app/models/area';
import { Router } from '@angular/router';
import { TestService } from 'src/app/services/test.service';
import { Test } from 'src/app/models/test';
import { element } from '@angular/core/src/render3';
import { QuestionInfo } from 'src/app/models/QuestionInfo';
import { ToastrService } from 'ngx-toastr';
import { Console } from '@angular/core/src/console';
import { AreaDeleteInfo } from 'src/app/models/areaDeleteInfo';

/* tslint:disable */
@Component({
	selector: 'app-view-test',
	templateUrl: './view-test.component.html',
	styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent implements OnInit {
	unsaved = false;
	questions_changed = false;
	testExist: boolean;
	areas: Area[] = [];
	removeAreaIndexs: number[] = [];
	removeQuestionsIndexs: number[] = [];
	testInfo: Test = new Test();
	questions: QuestionInfo[];
	oldTest: Test[] = [];
	areas_toDelete: Area [] = [];
	areas_deleteInfo: AreaDeleteInfo [] = [];
	active = false;
	Title = 'Test view';

	constructor(private router: Router, 
                private testService: TestService,
                private toastr: ToastrService) { }

	ngOnInit() {
		if(localStorage.ViewTestId !== undefined) {
			this.testExist = true;
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
		this.Title = 'New test';
	}

	onDeleteAreas(index: number) {
		this.stateChange();
		if (this.removeAreaIndexs.includes(index)) {
			this.removeAreaIndexs.splice(this.removeAreaIndexs.indexOf(index), 1);
		} else {
			this.removeAreaIndexs.push(index);
		}
	}

	onDeleteQuestions(index: number) {
		this.stateChange();
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

	back() {
		localStorage.removeItem('ViewTestId');
		this.router.navigate(['/admin']);
	}

	stateChange() {
		this.unsaved = true;
	}

	removeAreasClick() {
		this.stateChange();
		const temp = [];  
		for (let i = 0; i < this.areas.length; i++) {
			if (!this.removeAreaIndexs.includes(i)) {
				temp.push(this.areas[i]);
			} else {
				this.areas_toDelete.push(this.areas[i]);
			}
		}
		this.testService.checkAreasOnDelete(this.areas_toDelete, this.testInfo.TestId ).subscribe((info) => {
			this.areas_deleteInfo = info;
			if( this.areas_deleteInfo.length > 0 ) {
				this.toastr.toastrConfig.timeOut=10000;
					this.areas_deleteInfo.forEach(element => {
					this.toastr.warning('Name of the area: ' + element.AreaName + ' Number of realeted questions:' + element.NumOfQuestions );
					var area = new Area();
					area.AreaName = element.AreaName;
					area.TestAreaId = element.AreaId;
					temp.push(area);
				});
				this.toastr.info('Can\'t delete areas! Remove related questions or change their areas first!');
				this.toastr.toastrConfig.resetTimeoutOnDuplicate;
				this.removeAreaIndexs = [];
				this.areas = temp;
			} else {
				this.removeAreaIndexs = [];
				this.areas = temp;
			}		
			this.areas_toDelete = [];	
		});	
	}

	addAreaClick() {
		this.stateChange();
		const area = new Area();
		area.AreaName = 'Undefined area';
		area.TestAreaId = -1;
		this.areas.push(area);
	}

	removeQuestionClick() {
		if(this.removeQuestionsIndexs.length<1)	{
			return; 
		}
		this.stateChange();
		this.questions_changed = true;
		const temp = [];
		for (let i = 0; i < this.questions.length; i++) {
			if (!this.removeQuestionsIndexs.includes(i)) {
				temp.push(this.questions[i]);
			}
		}
		this.removeQuestionsIndexs = [];
		this.questions = temp;	
	}

	addNewQuestionClick() {
		if (this.unsaved) {
			if (confirm('There\'s unsaved changes, would you like to save them?')) {
				this.saveChanges();
			} else {
				localStorage.QuestionIndex = this.questions.length-1;
				this.router.navigate(['/question-view']);
			}
		} else {
			if(this.questions.length !== undefined) {
				localStorage.QuestionIndex = this.questions.length-1;
			} else {
				localStorage.QuestionIndex = 0;
			}	
			this.router.navigate(['/question-view']);
		}
	}

	saveChanges() {
		if( this.unsaved ) {
			console.log('Hey there');
			this.testService.updateTestInfo(this.testInfo).subscribe((testId:number) => {
				this.testInfo.TestId = testId;
				this.testService.updateAreas(this.areas,this.testInfo.TestId ).subscribe(() => {
							if(this.questions_changed) {
								this.testService.updateQuestions(this.testInfo.TestId, this.questions).subscribe(() => {	
								this.questions_changed=false;
								this.testService.getTestQuestionsById(this.testInfo.TestId).subscribe((questions) => {
									this.questions = questions;
								});		
							});
						}		
					});					
			});
			this.toastr.success('Changes successfully saved');
			return this.unsaved = false;
		}		
		this.toastr.info('There\'s no changes to save..');
	}

	cancelChanges() {
		this.unsaved = false;
		this.toastr.info('Changes were canceled!');
		this.ngOnInit();
	}

	editQuestion(index) {
		if (this.unsaved) {
			if (confirm('There\'s unsaved changes, would you like to save them?')) {
				this.saveChanges();
			} else {
				this.moveToTest(index);
			}
		}
		this.moveToTest(index);
	}

	moveToTest(index) {
		localStorage.ViewQuestionId = this.questions[index].QuestionId;
		localStorage.QuestionIndex = index;
		localStorage.setItem("Questions", JSON.stringify(this.questions));
		this.router.navigate(['/question-view']);
	}

}
