import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewAccountComponent } from './new-account/new-account.component';
import { ConnectComponent } from './connect/connect.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { ShowMenuComponent } from './show-menu/show-menu.component';
import { NewWalletComponent } from './new-wallet/new-wallet.component';
import { BalanceComponent } from './balance/balance.component';
import { VerifyPasswordComponent } from './verify-password/verify-password.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { VerifyMnemonicComponent } from './verify-mnemonic/verify-mnemonic.component';
import { ImportWalletComponent } from './import-wallet/import-wallet.component';
import { TransactionComponent } from './transaction/transaction.component';
import { ToastrModule } from 'ngx-toastr';
import { MultisignComponent } from './multisign/multisign.component';
import { ImportMultisignComponent } from './import-multisign/import-multisign.component';
import { SignLineComponent } from './sign-line/sign-line.component';
import { MultisignConfirmComponent } from './multisign-confirm/multisign-confirm.component';
import { MultisignSuccessComponent } from './multisign-success/multisign-success.component';

@NgModule({
  declarations: [
    AppComponent,
    NewAccountComponent,
    ConnectComponent,
    ShowMenuComponent,
    NewWalletComponent,
    BalanceComponent,
    VerifyPasswordComponent,
    VerifyMnemonicComponent,
    ImportWalletComponent,
    TransactionComponent,
    MultisignComponent,
    ImportMultisignComponent,
    SignLineComponent,
    MultisignConfirmComponent,
    MultisignSuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ClipboardModule,
    MatDialogModule,
    MatSelectModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
