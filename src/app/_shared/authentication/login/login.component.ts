import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    isLoginError = false;
    constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

    ngOnInit() {
    }

    OnSubmit(userName, password) {
        this.userService.userAuthentication(userName, password).subscribe((data: any) => {
            localStorage.setItem('userToken', data.access_token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userRole', data.role);
            if (JSON.parse(data.role) === 'Admin' || JSON.parse(data.role) === 'SuperAdmin') {
                this.router.navigate(['/admin']);
            } else {
                this.router.navigate(['/']);
            }
        },
            (err: HttpErrorResponse) => {
                this.toastr.error('Password or UserName is incorrect!');
            });
    }
}
