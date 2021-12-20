import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewAccountComponent } from './new-account/new-account.component';
import { ConnectComponent } from './connect/connect.component';
import { NewWalletComponent } from './new-wallet/new-wallet.component';
import { ShowMenuComponent } from './show-menu/show-menu.component';

const routes: Routes = [
  { path: 'new-account', component: NewAccountComponent },
  { path: 'connect', component: ConnectComponent },
  { path: 'new-wallet', component: NewWalletComponent },
  { path: 'display-options', component: ShowMenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
