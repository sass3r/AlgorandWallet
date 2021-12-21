import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-verify-mnemonic',
  templateUrl: './verify-mnemonic.component.html',
  styleUrls: ['./verify-mnemonic.component.scss']
})
export class VerifyMnemonicComponent implements OnInit {
  private walletName: string;
  private address: string;
  private privateKey: string;
  private mnemonic: string;
  private obfuscateKey: string;
  mnemonicForm: FormGroup;
  walletForm: FormGroup;
  errorMessage: string;
  passwordKey: string;
  word1: number;
  word2: number;
  word3: number;
  word4: number;
  verified: Boolean;

  constructor(
    private formBuilder: FormBuilder,
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    private router: Router
  ) { 
    this.errorMessage = "Revise el formulario";
    this.passwordKey = "masterKey";
    this.word1 = this.getRandomInt(1,26);
    this.word2 = this.getRandomInt(1,26);
    this.word3 = this.getRandomInt(1,26);
    this.word4 = this.getRandomInt(1,26);
    this.mnemonicForm = this.formBuilder.group({
      'word1': ['',[Validators.required]],
      'word2': ['',[Validators.required]],
      'word3': ['',[Validators.required]],
      'word4': ['',[Validators.required]],
    });
    this.walletForm = this.formBuilder.group({
      'name': ['',[Validators.required]]
    });
    this.verified = false;
    this.address = "";
    this.mnemonic = "";
    this.privateKey = "";
    this.obfuscateKey = "";
    this.walletName = "";
  }

  async ngOnInit() {
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "getObfuscateKey") {
        this.communicationService.emitChange({topic: 'setObfuscateKey', msg:this.obfuscateKey});
      }
    });
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "setWalletData") {
        let walletData = change.msg;
        this.mnemonic = walletData.mnemonic;
        this.address = walletData.address;
        this.privateKey = walletData.privateKey;
      }
    });
    this.communicationService.emitChange({topic: 'getWalletData'});
  }

  getWordForm(word: string): FormArray {
    return this.mnemonicForm.get(word) as FormArray;
  }

  getWalletNameForm(): FormArray {
    return this.walletForm.get('name') as FormArray;
  }

  verifyMnemonic(form: any): Boolean {
    console.log(this.address);
    console.log(this.mnemonic);
    console.log(this.privateKey);
    let mnemonic = this.mnemonic.split(" ");
    console.log(form)
    let entryWord1: string = form['word1'];
    let entryWord2: string = form['word2'];
    let entryWord3: string = form['word3'];
    let entryWord4: string = form['word4'];
    let res: Boolean = true;
    console.log(mnemonic);
    if(entryWord1 == mnemonic[this.word1-1]){
      console.log("word1");
      console.log(mnemonic[this.word1-1]);
      res = res && true;
    }else{
      res = res && false;
    }

    if(entryWord2 == mnemonic[this.word2-1]){
      console.log("word2");
      console.log(mnemonic[this.word2-1]);
      res = res && true;
    }else{
      res = res && false;
    }

    if(entryWord3 == mnemonic[this.word3-1]){
      console.log("word3");
      console.log(mnemonic[this.word3-1]);
      res = res && true;
    }else{
      res = res && false;
    }

    if(entryWord4 == mnemonic[this.word4-1]){
      console.log("word4");
      console.log(mnemonic[this.word4-1]);
      res = res && true;
    }else{
      res = res && false;
    }
    return res;
  }

  onSubmit(form: any) {
    let verification = this.verifyMnemonic(form);
    console.log(verification);
    if(verification){
      this.verified = true;
    }
  }

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async registerWallet(form: any) {
    this.walletName = form['name'];
    this.verifyPasswordOpenDialog();
  }

  async savePrivKey() {
    let key = "privateKey";
    let data = new Uint8Array(Buffer.from(this.privateKey));
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
}
