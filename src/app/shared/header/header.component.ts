import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public logout(data: any) {
    console.log('logout here .. .. ..');
    localStorage.removeItem('PL_userId');
    this.router.navigateByUrl('/index');
  }

}
