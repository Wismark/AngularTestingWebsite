import { Component, OnInit } from '@angular/core';
import { User } from '../auth models/user.model';
import { NgForm } from '@angular/forms';
import { UserService } from '../auth services/user.service';
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user : User;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private userService: UserService, private toastr: ToastrService) { }

  ngOnInit() {
    this.user = {
      LastName:'',
      FirstName:'',
      MiddleName:'',
      Email:'',
      Password:'',
      Login:'',
      DateOfBirth: new Date()
    }

  }

  resetForm(form? : NgForm)
  {
    if(form !=null)
    {
    form.reset();
    this.user = {
      LastName:'',
      FirstName:'',
      MiddleName:'',
      Email:'',
      Password:'',
      Login:'',
      DateOfBirth: new Date()
    }
    }
  }

  OnSubmit(form: NgForm) {
    this.userService.registerUser(form.value)
    .subscribe( (data:any) => {
      if (data.Succeeded == true) {
        this.resetForm(form);
        this.toastr.success('User registration successful');
      }
      else
        this.toastr.error(data.Errors[0]);
    });
  }

}
