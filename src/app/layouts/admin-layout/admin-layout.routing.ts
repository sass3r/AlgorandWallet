import { Routes } from '@angular/router';
import { NewAccountComponent } from '../../wallet/new-account/new-account.component';
import { ConnectComponent } from '../../wallet/connect/connect.component';
import { NewWalletComponent } from '../../wallet/new-wallet/new-wallet.component';
import { ShowMenuComponent } from '../../wallet/show-menu/show-menu.component';
import { BalanceComponent } from '../../wallet/balance/balance.component';
import { VerifyPasswordComponent } from '../../wallet/verify-password/verify-password.component';
import { VerifyMnemonicComponent } from '../../wallet/verify-mnemonic/verify-mnemonic.component';
import { ImportWalletComponent } from '../../wallet/import-wallet/import-wallet.component';
import { TransactionComponent } from '../../wallet/transaction/transaction.component';
import { MultisignComponent } from '../../wallet/multisign/multisign.component';
import { ImportMultisignComponent } from '../../wallet/import-multisign/import-multisign.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'new-account', component: NewAccountComponent },
    { path: 'connect', component: ConnectComponent },
    { path: 'new-wallet', component: NewWalletComponent },
    { path: 'display-options', component: ShowMenuComponent },
    { path: 'balance', component: BalanceComponent },
    { path: 'balance/:key', component: BalanceComponent },
    { path: 'verify', component: VerifyPasswordComponent },
    { path: 'verify-mnemonic', component: VerifyMnemonicComponent },
    { path: 'import', component: ImportWalletComponent },
    { path: 'transfer', component: TransactionComponent },
    { path: 'multisign', component: MultisignComponent },
    { path: 'import-multisign', component: ImportMultisignComponent }
];
