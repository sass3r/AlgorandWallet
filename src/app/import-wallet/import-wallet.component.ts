import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router } from '@angular/router';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import { CommunicationService } from '../services/communication.service';
import { MatDialog } from '@angular/material/dialog';
import algosdk from 'algosdk';


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
  }

  ngOnInit(): void {
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
      width: '230px'
    });
    passwordDialog.afterClosed().subscribe(async (result: any) => {
      this.obfuscateKey = result;
      await this.savePrivKey();
      await this.saveWallet();
      this.router.navigateByUrl('balance');
    });
  }

  async savePrivKey() {
    let key = "privateKey";
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
    console.log(this.obfuscateKey);
    let key =  "wallet";
    let appStorage = new AppStorage(this.obfuscateKey);
    let obj = {
      name: this.walletName,
      address: this.address,
      mnemonic: this.mnemonic
    };
    console.log(obj);
    await appStorage.saveItemToStorage(key,obj)
    .then(() => {
      console.log("Wallet stored");
    })
    .catch(e => {
      console.log("fail to store wallet");
      console.log(e);
    });
  }
}
