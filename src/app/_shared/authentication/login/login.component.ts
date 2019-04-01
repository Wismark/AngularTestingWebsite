import { Component, OnInit } from '@angular/core';
import { UserService } from '../auth services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginError: boolean = false;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  OnSubmit(userName, password){
    console.log(userName + " " + password);
    this.userService.userAuthentication(userName, password).subscribe((data: any ) => {
      localStorage.setItem('userToken', data.access_token);
      this.router.navigate(['/']);
    },
    (err: HttpErrorResponse) => {
      this.isLoginError = true;
    } );
  }
}
