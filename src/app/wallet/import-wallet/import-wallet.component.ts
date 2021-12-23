import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router, NavigationEnd } from '@angular/router';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import { CommunicationService } from '../services/communication.service';
import { MatDialog } from '@angular/material/dialog';
import algosdk from 'algosdk';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-import-wallet',
  templateUrl: './import-wallet.component.html',
  styleUrls: ['./import-wallet.component.scss']
})
export class ImportWalletComponent implements OnInit {
  private walletName: string;
  private address: string;
  private privateKey: Uint8Array;
  private mnemonic: string;
  private passwordKey: string;
  private obfuscateKey: string;
  importForm: FormGroup;
  errorMessage: string;
  count: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private communicationService: CommunicationService,
  ) { 
    this.importForm = this.formBuilder.group({
      'walletName': ['',[Validators.required]],
      'mnemonic': ['',[Validators.required]],
    });
    this.walletName = "";
    this.address = "";
    this.mnemonic = "";
    this.privateKey = new Uint8Array();
    this.passwordKey = "masterKey";
    this.errorMessage = "Revise el formulario";
    this.obfuscateKey = "";
    this.count = "0";
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (event.id === 1 && event.url === event.urlAfterRedirects) {
        this.router.navigateByUrl('connect');
      }
    });
  }

  async ngOnInit() {
    this.count = await AppStorage.getItem("count");
    let id = parseInt(this.count) + 1
    this.count = id.toString();
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "getObfuscateKey") {
        this.communicationService.emitChange({topic: 'setObfuscateKey', msg:this.obfuscateKey});
      }
    });
  }

  getWalletNameForm(): FormArray {
    return this.importForm.get('walletName') as FormArray;
  }

  getMnemonicForm(): FormArray {
    return this.importForm.get('mnemonic') as FormArray;
  }

  async onSubmit(form: any) {
    this.mnemonic = form['mnemonic'];
    this.walletName = form['walletName'];
    let account = await algosdk.mnemonicToSecretKey(this.mnemonic);
    this.address = account.addr;
    this.privateKey = account.sk;
    console.log("Address: ", account.addr);
    console.log("PrivateKey: ", account.sk);
    this.verifyPasswordOpenDialog();
  }

  verifyPasswordOpenDialog() {
    let passwordDialog = this.dialog.open(VerifyPasswordComponent,{
      width: '230px',
      disableClose: true,
    });
    passwordDialog.afterClosed().subscribe(async (result: any) => {
      this.obfuscateKey = result;
      await this.savePrivKey();
      await this.saveWallet();
      AppStorage.setItem("count",this.count);
      this.router.navigateByUrl('balance');
    });
  }

  async savePrivKey() {
    let key = "privateKey_"+this.count;
    let data = this.privateKey
    await AppStorage.savePrivatekeyToStorage(key,this.passwordKey,data)
    .then(() => {
      console.log("PrivateKey stored");
    })
    .catch(e => {
      console.log("fail to store privateKey");
      console.log(e);
    });
  }

  async saveWallet() {
    let key =  "wallet_"+this.count;
    let appStorage = new AppStorage(this.obfuscateKey);
    let obj = {
      name: this.walletName,
      address: this.address,
      mnemonic: this.mnemonic,
      multisign: false
    };
    await appStorage.saveItemToStorage(key,obj)
    .catch(e => {
      console.log("fail to store wallet");
      console.log(e);
    });
  }

}
