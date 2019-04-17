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
import { UserAnswer } from '../models/userAnswer';
import {formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
})

/* tslint:disable */
export class TestService {
    constructor(private http: HttpClient) {
        console.log('Data service connected...');
    }

    APIurl = 'http://localhost:50672/api/';

    getTests(active: boolean): Observable<Test[]> {
        return this.http.get<Test[]>(`${this.APIurl}tests/` + active);
    }

    getCurrentQuestionID(index, testId) {
        return this.http.get(`${this.APIurl}test-process/${index}/${testId}`);
    }

    getTestResultsByUserId(userId: string): Observable<Results[]> {
        return this.http.get<Results[]>(`${this.APIurl}results/` + userId);
    }

    getUsersWithResults(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.APIurl}users/result`);
    }

    getAllUsers(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.APIurl}users`);
    }

    getTestInfoById(testId: number): Observable<Test> {
        return this.http.get<Test>(`${this.APIurl}test-info/` + testId);
    }

    getTestAreaById(testId: number): Observable<Area[]> {
        return this.http.get<Area[]>(`${this.APIurl}tests/areas/` + testId);
    }

    getTestQuestionsById(testId: number): Observable<QuestionInfo[]> {
        return this.http.get<QuestionInfo[]>(`${this.APIurl}tests/questions/` + testId);
    }

    addNewTestQuestion(info: QuestionInfo) {
        const body = { Text: info.Text, QuestionType: info.QuestionType, TestId: info.TestId, AreaId: info.AreaId };

        return this.http.post(`${this.APIurl}tests/new-questions/`, body);
    }

    addAnswersToQuestion(questionId, answers: Answer[]) {
        const body = { answers, questionId };

        return this.http.post(`${this.APIurl}question/answers/`, body);
    }

    addImagesToQuestion(questionId, images: File[]) {
        const endpoint = `${this.APIurl}question/images/`;
        const formData = new FormData();

        images.forEach(img => {
            formData.append('uploadedFiles', img, img.name);
        });

        return this.http.post(`${this.APIurl}question/images/${questionId}`, formData);
    }

    getQuestionImages(questionId: number): Observable<ImageInfo[]> {
        return this.http.get<ImageInfo[]>(`${this.APIurl}question/get-images/` + questionId);
    }

    getQuestionInfoById(questionId: number): Observable<QuestionInfo> {
        return this.http.get<QuestionInfo>(`${this.APIurl}question/` + questionId);
    }

    getQuestionAnswersById(questionId: number): Observable<Answer[]> {
        return this.http.get<Answer[]>(`${this.APIurl}question/answers/` + questionId);
    }

    updateTestQuestion(info: QuestionInfo) {
        const body = { Text: info.Text, QuestionType: info.QuestionType, TestId: info.TestId, AreaId: info.AreaId, QuestionId: info.QuestionId };

        return this.http.put(`${this.APIurl}tests/update-questions/`, body);
    }

    updateQuestionImages(QuestionId, imagesInfos) {
        const body = { questionId: QuestionId, ImageInfos: imagesInfos };

        return this.http.put(`${this.APIurl}question/update-images/`, body);
    }

    updateQuestions(testId: number, questions: QuestionInfo[]) {
        const body = { testId, questions };

        return this.http.post(`${this.APIurl}test/update-question/`, body);
    }

    updateTestInfo(info: Test) {
        return this.http.put(`${this.APIurl}test-update/`, info);
    }

    updateAreas(areas: Area[], testId: number) {
        const body = { Areas: areas, TestID: testId };

        return this.http.post(`${this.APIurl}test/update-areas/`, body);
    }

    checkAreasOnDelete(areas: Area[], testId: number): Observable<AreaDeleteInfo[]> {
        const body = { Areas: areas, TestID: testId };
        return this.http.post<AreaDeleteInfo[]>(`${this.APIurl}test/check-areas/`, body);
    }

    checkUsersTestResult(time:number, answers: UserAnswer[], userId:any, testid:number) {
        let date = formatDate(new Date(), 'yyyy/MM/dd hh:mm:ss', 'en');
        const body = { Answers: answers, UserId:userId, TestId:testid, startDate:date, UserTime:time};
        return this.http.post<UserAnswer[]>(`${this.APIurl}test/check-result/`, body);
    }

    getTestResult(resultId) {
        return this.http.get<Results>(`${this.APIurl}test/result/`+ resultId);
    }
}
