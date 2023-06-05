import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteKeys } from 'src/core/Routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'layoff-analytics';

  constructor(
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.router.navigate([`${RouteKeys.Home}`]);
  }
}
