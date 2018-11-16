import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

declare function setIndex(): any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.document.body.classList.remove('login_bg');
    //setIndex();
  }

}
