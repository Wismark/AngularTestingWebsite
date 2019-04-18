import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-forbidden',
    templateUrl: './forbidden.component.html',
    styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit() {
    }

    back() {
        if (localStorage.userId === undefined) {
            return this.router.navigate(['/login']);
        }
        if (localStorage.userRole.includes('Admin') || localStorage.userRole.includes('SuperAdmin')) {
            return this.router.navigate(['/admin']);
        }
        return this.router.navigate(['/']);
    }
}
