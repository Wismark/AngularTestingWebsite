import { Component, OnInit } from '@angular/core';
import { Test } from 'src/app/models/test';
import { Results } from 'src/app/models/result';
import { TestService } from '../../../services/test.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_shared/authentication/auth services/user.service';
import { UserModel } from 'src/app/models/userModel';
import { ToastrService } from 'ngx-toastr';

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

  testSelect: number;
  userResult: number;
  userTest: number;
  userForRole: string;

  constructor(private userService: UserService, private testService: TestService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.testService.getTests().subscribe(tests => {
    this.tests = tests;
    });

    this.testService.getUsersWithResults().subscribe(users => {
      this.users = users;
    });

    this.testService.getAllUsers().subscribe(users => {
      this.allUsers = users;
    });

    this.testSelect = 0;
    this.userResult = 0;
    this.userTest = 0;
    this.userForRole = '123';
  }

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

  SetAdminClick() {
    this.userService.SetAdminRole(this.userForRole).subscribe( (data: any) => {
      this.CheckRoleChangeResponse(data);
    });
  }

  SetUserClick() {
    this.userService.SetUserRole(this.userForRole).subscribe( (data: any) => {
      this.CheckRoleChangeResponse(data);
    });
  }

  CheckRoleChangeResponse( response: number)  {
    if (response === 0) {
      this.toastr.error('Error, user not found!');
    }
    if (response === 1 ) {
      this.toastr.success('Role was updated!');
      this.ngOnInit();
    }
    if (response === 2 ) {
        this.toastr.warning('User already have this role!');
    }
    if (response === 3 ) {
      this.toastr.error ('Error! Cannot update this user role');
    }
  }


  EditTestSelectClick() {
    localStorage.ViewTestId = this.testSelect;
    this.router.navigate(['/test-view']);
  }

  StartTestClick() {
    console.log(this.testSelect);
  }
}
