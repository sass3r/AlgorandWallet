import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AlgorandWallet';
  
  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('connect');
    }, 1000);
  }
}
