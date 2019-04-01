import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/models/area';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent implements OnInit {
  areas: Area [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.areas = [
      { AreaName: 'Math', TestAreaId: 12 },
      { AreaName: 'Algebra', TestAreaId: 2 },
      { AreaName: 'Dance', TestAreaId: 3 },
      ];
  }

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }

}
