import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Test } from '../models/test';
import { Results } from '../models/result';
import { Observable } from 'rxjs';
import { User } from '../_shared/authentication/auth models/user.model';
import { UserModel } from '../models/userModel';
import { Area } from '../models/area';
import { QuestionInfo } from '../models/QuestionInfo';
import { Answer } from '../models/answer';
import { ImageInfo } from '../models/ImageInfo';
import { AreaDeleteInfo } from '../models/areaDeleteInfo';


@Injectable({
  providedIn: 'root'
})

/* tslint:disable */
export class TestService {
  constructor(private http: HttpClient) {
    console.log('Data service connected...');
  }

  APIurl = 'http://localhost:50672';

  getTests(active: boolean): Observable<Test[]> {
    return this.http.get<Test[]>(`${this.APIurl}/api/tests/` + active);
  }

  getCurrentQuestionID(index, testId) {
    return this.http.get(`${this.APIurl}/api/test-process/${index}/${testId}`);
  }

  getTestResultsByUserId(userId: string): Observable<Results[]> {
    return this.http.get<Results[]>(`${this.APIurl}/api/results/` + userId);
  }

  getUsersWithResults(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.APIurl}/api/users/result`);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.APIurl}/api/users`);
  }

  getTestInfoById(testId: number): Observable<Test> {
    return this.http.get<Test>(`${this.APIurl}/api/test-info/` + testId );
  }

  getTestAreaById(testId: number): Observable<Area[]> {
    return this.http.get<Area[]>(`${this.APIurl}/api/tests/areas/` + testId );
  }

  getTestQuestionsById(testId: number): Observable<QuestionInfo[]> {
    return this.http.get<QuestionInfo[]>(`${this.APIurl}/api/tests/questions/` + testId );
  }

  addNewTestQuestion(info: QuestionInfo) {
    const body = {Text: info.Text, QuestionType: info.QuestionType, TestId: info.TestId, AreaId: info.AreaId };

    return this.http.post(`${this.APIurl}/api/tests/new-questions/`, body);
  }

  addAnswersToQuestion(questionId, answers: Answer []) {
    const body = { answers, questionId };

    return this.http.post(`${this.APIurl}/api/question/answers/`, body);
  }

  addImagesToQuestion(questionId, images: File []) {
    const endpoint = `${this.APIurl}/api/question/images/`;
    const formData = new FormData();

	images.forEach(img => {
		formData.append('uploadedFiles',  img, img.name);
	});

    return this.http.post(`${this.APIurl}/api/question/images/${questionId}`, formData);
  }

  getQuestionImages(questionId: number): Observable<ImageInfo[]> {
    return this.http.get<ImageInfo[]>(`${this.APIurl}/api/question/get-images/` + questionId );
  }

  getQuestionInfoById(questionId: number): Observable<QuestionInfo> {
	return this.http.get<QuestionInfo>(`${this.APIurl}/api/question/` + questionId );
  }

  getQuestionAnswersById(questionId: number): Observable<Answer[]> {
	return this.http.get<Answer[]>(`${this.APIurl}/api/question/answers/` + questionId );
  }

  updateTestQuestion(info: QuestionInfo) {
	const body = {Text: info.Text, QuestionType: info.QuestionType, TestId: info.TestId, AreaId: info.AreaId, QuestionId: info.QuestionId };

    return this.http.put(`${this.APIurl}/api/tests/update-questions/`, body);
  }

  updateQuestionImages(QuestionId, imagesInfos) {
    const body = {questionId: QuestionId, ImageInfos:imagesInfos };
  
      return this.http.put(`${this.APIurl}/api/question/update-images/`, body);
    }

    updateQuestions(testId: number, questions: QuestionInfo []) {
      const body = { testId, questions };
  
      return this.http.post(`${this.APIurl}/api/test/update-question/`, body);
    } //updateTestInfo

    updateTestInfo(info: Test) {
      return this.http.put(`${this.APIurl}/api/test-update/`, info);
    }

    updateAreas(areas: Area [], testId:number) {
      const body = { Areas:areas, TestID:testId };
  
      return this.http.post(`${this.APIurl}/api/test/update-areas/`, body);
    } 

    checkAreasOnDelete(areas: Area [], testId:number): Observable<AreaDeleteInfo[]> {
      const body = { Areas:areas, TestID:testId };
      return this.http.post<AreaDeleteInfo[]>(`${this.APIurl}/api/test/check-areas/`, body);
    }
} //checkAreasOnDelete AreaDeleteInfo
