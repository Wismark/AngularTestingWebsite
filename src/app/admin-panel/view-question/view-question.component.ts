import { Component, OnInit, ViewChild } from '@angular/core';
import { Area } from 'src/app/models/area';
import { TestService } from 'src/app/services/test.service';
import { ToastrService } from 'ngx-toastr';
import { Answer } from 'src/app/models/answer';
import { Router } from '@angular/router';
import { QuestionInfo } from 'src/app/models/QuestionInfo';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageInfo } from 'src/app/models/ImageInfo';

/* tslint:disable */
@Component({
	selector: 'app-view-question',
	templateUrl: './view-question.component.html',
	styleUrls: ['./view-question.component.css']
	
})
export class ViewQuestionComponent implements OnInit {
	questionExists = false;
	title = 'Question creation'; Files = '';
	testAreas: Area[] = [];
	answers: Answer[] = [];
	areaSelect: number;
	removeAnswersIndexs: number[] = [];
	images: File[] = [];
	imagesUrl: any[] = [];
	imagesInfos: ImageInfo[] = [];
	Qtype = 'radio';
	questionID: number;
	info: QuestionInfo = new QuestionInfo();

	constructor(private router: Router,
                private testService: TestService,
                private toastr: ToastrService,
                private _DomSanitizationService: DomSanitizer) { }

	ngOnInit() {

		if (localStorage.ViewQuestionId !== undefined) {
			this.questionID = localStorage.ViewQuestionId;
			this.questionExists = true;
			this.title = 'Question edit';

			this.testService.getQuestionInfoById(this.questionID).subscribe( (info) => {
					this.info = info;
					this.info.QuestionId = this.questionID;
					this.Qtype = this.info.QuestionType;
					this.testService.getTestAreaById(localStorage.ViewTestId).subscribe((areas) => {
					this.testAreas = areas;								
					this.areaSelect = this.testAreas.findIndex( (element) => {
						return element.TestAreaId == this.info.AreaId;
					})
				});				
			});

			this.testService.getQuestionAnswersById(this.questionID).subscribe( (answers) => {
				this.answers = answers;
			});

			this.testService.getQuestionImages(this.questionID).subscribe( (imageInfo) => {
				this.imagesInfos = imageInfo;
				this.imagesUrl = [];
				this.imagesInfos.forEach( (info) => {
					this.imagesUrl.push(info.ImageUrl);
				})
			});
			
		} else {
			this.info.Text = 'Default question?';
			this.info.AreaId = -1;
			this.info.QuestionId = -1;
			this.info.TestId = localStorage.ViewTestId;
			this.testService.getTestAreaById(localStorage.ViewTestId).subscribe((areas) => {
				this.testAreas = areas;
				this.areaSelect = 0;
			});
			this.answers = [{ Text: 'Default', Correct: false }];
		}
	}

	onClickLogout() {
		localStorage.removeItem('userToken');
		this.router.navigate(['/login']);
	}

	onClickBack() {
		localStorage.removeItem('ViewQuestionId');
		this.router.navigate(['/test-view']);
	}

	qTypeChange(type: number) {
		if (type === 1) {
			this.Qtype = 'radio';
		}
		if (type === 2) {
			this.Qtype = 'check';
		}	
		this.answers.forEach(e => e.Correct = false);
	}
	//#region Answers
	addAnswerClick() {
		const asw = new Answer();
		asw.Text = 'Default';
		asw.Correct = false;
		this.answers.push(asw);
	}

	onChangeCorrect(index: number) {
		if (this.Qtype === 'radio') {
			this.answers.forEach( a => a.Correct = false)
			this.answers[index].Correct = true;
		} else {
			if(this.answers[index].Correct) {
                this.answers[index].Correct = false;
            } else {
                this.answers[index].Correct = true;
            }             
		}
	}

	onDeleteAnswers(index: number) {
		if (this.removeAnswersIndexs.includes(index)) {
			this.removeAnswersIndexs.splice(this.removeAnswersIndexs.indexOf(index), 1);
		} else {
			this.removeAnswersIndexs.push(index);
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
	//#endregion

	//#region Images

	onFileAdded($event) {
		console.log('Loader!');
		const files = $event.target.files;
		if (files !== undefined) {
			for (let i = 0; i < files.length; i++) {
				if (files[i].type === 'image/jpeg' || files[i].type === 'image/png') {
					this.images.push(files[i]);
					this.viewImages(files[i]);
					this.Files += files[i].name + '; ';
				} else {
					this.toastr.info('Files should be images 50x50px or 200x200px..');
					this.toastr.error('Inappropriate file!');
				}
			}
		}
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
		this.Files = 'Unsaved images :';
		this.images.forEach(img => {
			this.Files += img.name + '; ';
		});
	}

	removeImages(index: number) {
		if (!this.questionExists) {
			this.images.splice(this.images.indexOf(this.images[index]), 1);
			this.imagesUrl.splice(this.imagesUrl.indexOf(this.imagesUrl[index]), 1);
			this.updateImagesText();
		} else {
			if( this.images.length > 0) {
				if(index > this.imagesInfos.length) {	
					this.images.splice(this.images.indexOf(this.images[index-this.imagesInfos.length]), 1);
					this.imagesUrl.splice(this.imagesUrl.indexOf(this.imagesUrl[index]), 1);
				} else {
					this.imagesUrl.splice(this.imagesUrl.indexOf(this.imagesUrl[index]), 1);
					this.imagesInfos.splice(this.imagesInfos.indexOf(this.imagesInfos[index]), 1);
				}
			} else {
				this.imagesUrl.splice(this.imagesUrl.indexOf(this.imagesUrl[index]), 1);
				this.imagesInfos.splice(this.imagesInfos.indexOf(this.imagesInfos[index]), 1);
			}
		}		
	}

	uploadImagesClick() {
		if (this.questionExists) {
			if(this.images.length>0 ) {
				this.testService.addImagesToQuestion(this.questionID, this.images).subscribe(() => {
					this.testService.getQuestionImages(this.questionID).subscribe( (imageInfo) => {
						this.images = [];
						this.imagesInfos = imageInfo;
						this.imagesUrl = [];
						this.imagesInfos.forEach( (info) => {
							this.imagesUrl.push(info.ImageUrl);
						})
					});	
				});
				this.Files = '';
				this.toastr.success('New images were uploaded!');
			} else {
				this.toastr.info('There\'s no images to load!');
			}		
		} else {
			this.toastr.info('Question is new. Save question first!');
		}
	}

	checkAnswers() {
		let correct = false;
		if (this.answers.length > 1) {
			this.answers.forEach(a => {
				if (a.Correct) {
					correct = true;
				}
			});
		}
		return correct;
	}
	//#endregion

	//#region Bottom menu

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
			this.info.QuestionId = this.questionID;
			this.testService.updateTestQuestion(this.info).subscribe(() => {
			});			
			this.testService.addAnswersToQuestion(this.info.QuestionId, this.answers).subscribe(() => {
			});
			
			if(this.images.length > 0) {
					this.testService.addImagesToQuestion(this.info.QuestionId, this.images).subscribe(() => {
						this.images = [];
						this.testService.updateQuestionImages(this.info.QuestionId, this.imagesInfos).subscribe(() => {			
							this.testService.getQuestionImages(this.questionID).subscribe( (imageInfo) => {
								this.imagesInfos = imageInfo;
								this.imagesUrl = [];
								this.imagesInfos.forEach( (info) => {
									this.imagesUrl.push(info.ImageUrl);
								})
							});	
						});
				});
				this.Files = '';
			}

			return this.toastr.success('Question was updated!'); 
		}

		this.info.QuestionType = this.Qtype;
		this.info.AreaId = this.testAreas[this.areaSelect].TestAreaId;
		this.testService.addNewTestQuestion(this.info).subscribe((questionId: any) => {
			this.testService.addAnswersToQuestion(questionId, this.answers).subscribe(() => {
			});
			this.testService.addImagesToQuestion(questionId, this.images).subscribe(() => {
				this.images = [];
				this.Files = '';
			});
			this.questionID = questionId;
			this.questionExists = true;
			this.toastr.success('Question was created succesfully!');
		});

	}

	cancelQclick() {
		this.ngOnInit();
	}

	nextQclick() {
		let index = localStorage.QuestionIndex;
		let questions = JSON.parse(localStorage.Questions);
		console.log(index);
		console.log(questions);
		if(index < questions.length-1) {
			index++;
			localStorage.ViewQuestionId = questions[index].QuestionId;
			localStorage.QuestionIndex = index;
			this.ngOnInit();	
		}
	}

	lastQclick() {
		let questions = JSON.parse(localStorage.Questions);
		let index = questions.length-1;
		localStorage.ViewQuestionId = questions[index].QuestionId;
		localStorage.QuestionIndex = questions.length; 
		this.ngOnInit();
	}

	previousQclick() {
		let index = localStorage.QuestionIndex;
		let questions = JSON.parse(localStorage.Questions);
		console.log(index);
		console.log(questions);
		if(index > 0) {
			index--;
			localStorage.ViewQuestionId = questions[index].QuestionId;
			localStorage.QuestionIndex = index;
			this.ngOnInit();	
		}
	}

	firstQclick() {	
		let questions = JSON.parse(localStorage.Questions);
		localStorage.ViewQuestionId = questions[0].QuestionId;
		localStorage.QuestionIndex = 0;
		this.ngOnInit();	
	}
	//#endregion
}
