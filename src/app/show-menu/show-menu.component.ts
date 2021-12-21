import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-menu',
  templateUrl: './show-menu.component.html',
  styleUrls: ['./show-menu.component.scss']
})
export class ShowMenuComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  newWallet() {
    this.router.navigateByUrl('new-wallet');
  }

  importWallet() {
    this.router.navigateByUrl('import');
  }

}
