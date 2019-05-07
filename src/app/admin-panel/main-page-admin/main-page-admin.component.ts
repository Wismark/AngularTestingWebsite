import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/models/test';
import { Results } from 'src/app/models/result';
import { TestService } from '../../services/test.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_shared/authentication/auth services/user.service';
import { UserModel } from 'src/app/models/userModel';
import { ToastrService } from 'ngx-toastr';
import { TestResultsService } from 'src/app/services/test-results.service';

@Component({
    selector: 'app-main-page-admin',
    templateUrl: './main-page-admin.component.html',
    styleUrls: ['./main-page-admin.component.css']
})
export class MainPageAdminComponent implements OnInit {
    tests: Test[];
    results: Results[];
    users: UserModel[];
    allUsers: UserModel[];

    testSelect: any;
    userForResult: any;
    resultSelect: any;
    userForRole: string;

    constructor(private userService: UserService,
                private testService: TestService,
                private router: Router,
                private toastr: ToastrService,
                private testResultsService: TestResultsService) { }

    ngOnInit() {
        this.testService.getTests(false).subscribe(tests => {
            this.tests = tests;
        });

        this.testService.getUsersWithResults().subscribe(users => {
            this.users = users;
        });

        this.testService.getAllUsers().subscribe(users => {
            this.allUsers = users;
        });

        if (localStorage.UserForResult !== undefined) {
            this.userForResult = localStorage.UserForResult;
            localStorage.removeItem('UserForResult');
            this.userClick();
        } else {
            this.userForResult = 0;
        }

        this.testSelect = 0;
        this.resultSelect = 0;
        this.userForRole = '123';
    }

    Logout() {
        localStorage.removeItem('userToken');
        this.router.navigate(['/login']);
    }

    SetAdminClick() {
        this.userService.setAdminRole(this.userForRole).subscribe((data: any) => {
            this.checkRoleChangeResponse(data);
        });
    }

    SetUserClick() {
        this.userService.setUserRole(this.userForRole).subscribe((data: any) => {
            this.checkRoleChangeResponse(data);
        });
    }

    checkRoleChangeResponse(response: number) {
        if (response === 0) {
            this.toastr.error('Error, user not found!');
        }
        if (response === 1) {
            this.toastr.success('Role was updated!');
            this.ngOnInit();
        }
        if (response === 2) {
            this.toastr.warning('User already have this role!');
        }
        if (response === 3) {
            this.toastr.error('Error! Cannot update this user role');
        }
    }


    editTestSelectClick() {
         if (parseInt(this.testSelect, 10) > 0) {
        localStorage.ViewTestId = this.testSelect;
        this.router.navigate(['/test-view']);
        }
    }

    newVersionTestSelectClick() {
         if (parseInt(this.testSelect, 10) > 0) {
        localStorage.ViewTestId = this.testSelect;
        localStorage.NewVersion = true;
        this.router.navigate(['/test-view']);
         }
    }

    startTestClick() {
        if (parseInt(this.testSelect, 10) > 0) {
            localStorage.TestInUseId = this.testSelect;
            const index = this.tests.findIndex((test) => test.TestId === parseInt(this.testSelect, 10));
            localStorage.CurrentIndex = 0;
            const count = this.tests[index].NumOfQuestions;
            localStorage.TestInUseCount = count;
            localStorage.TestInUseTime = this.tests[index].TimeLimitation * 60;
            this.router.navigate(['/test']);
        }
    }

    newTest() {
        this.router.navigate(['/test-view']);
    }

    userResultSelect() {
        if (this.resultSelect > 0) {
            localStorage.UserResultId = this.resultSelect;
            localStorage.UserForResult = this.userForResult;
            this.router.navigate(['/results']);
        }
    }

    userClick() {
        this.testResultsService.getTestResultsByUserId(this.userForResult).subscribe((results) => {
            this.results = results;
        });
    }
}
