import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/*
set function for dashboard to call set design
*/
declare function setDashboard(): any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.document.body.classList.remove('login_bg');
    // this.document.body.classList.add('navSmall');
    /*
    set function for dashboard to call set design
    */
    setDashboard();
  }

}
