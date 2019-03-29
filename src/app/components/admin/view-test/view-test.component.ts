import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/models/area';

@Component({
  selector: 'app-view-test',
  templateUrl: './view-test.component.html',
  styleUrls: ['./view-test.component.css']
})
export class ViewTestComponent implements OnInit {
  areas: Area [];
  constructor() { }

  ngOnInit() {
    this.areas = [
      { AreaName: 'Math', TestAreaId: 12 },
      { AreaName: 'Algebra', TestAreaId: 2 },
      { AreaName: 'Dance', TestAreaId: 3 },
      ];
  }

}
