import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewAccountComponent } from './new-account/new-account.component';
import { ConnectComponent } from './connect/connect.component';
import { NewWalletComponent } from './new-wallet/new-wallet.component';
import { ShowMenuComponent } from './show-menu/show-menu.component';
import { BalanceComponent } from './balance/balance.component';
import { VerifyPasswordComponent } from './verify-password/verify-password.component';
import { VerifyMnemonicComponent } from './verify-mnemonic/verify-mnemonic.component';
import { ImportWalletComponent } from './import-wallet/import-wallet.component';


const routes: Routes = [
  { path: 'new-account', component: NewAccountComponent },
  { path: 'connect', component: ConnectComponent },
  { path: 'new-wallet', component: NewWalletComponent },
  { path: 'display-options', component: ShowMenuComponent },
  { path: 'balance', component: BalanceComponent },
  { path: 'verify', component: VerifyPasswordComponent },
  { path: 'verify-mnemonic', component: VerifyMnemonicComponent },
  { path: 'import', component: ImportWalletComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
