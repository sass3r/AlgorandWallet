import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-show-menu',
  templateUrl: './show-menu.component.html',
  styleUrls: ['./show-menu.component.scss']
})
export class ShowMenuComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (event.id === 1 && event.url === event.urlAfterRedirects) {
        console.log("Refreshed");
        this.router.navigateByUrl('connect');
      }
    });

   }

  ngOnInit(): void {
  }

  newWallet() {
    this.router.navigateByUrl('new-wallet');
  }

  importWallet() {
    this.router.navigateByUrl('import');
  }

  multisignWallet() {
    this.router.navigateByUrl('multisign');
  }

  importMultisignWallet() {
    this.router.navigateByUrl('import-multisign');
  }

}
