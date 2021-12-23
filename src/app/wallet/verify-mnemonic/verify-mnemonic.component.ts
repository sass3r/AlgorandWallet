import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router, NavigationEnd } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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
  addressBook: Array<any>;
  mnemonicForm: FormGroup;
  walletForm: FormGroup;
  errorMessage: string;
  passwordKey: string;
  word1: number;
  word2: number;
  word3: number;
  word4: number;
  verified: Boolean;
  count: any;

  constructor(
    private formBuilder: FormBuilder,
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService
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
    this.addressBook = [];
    this.count = "0";
    this.verified = false;
    this.address = "";
    this.mnemonic = "";
    this.privateKey = "";
    this.obfuscateKey = "";
    this.walletName = "";
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
    let mnemonic = this.mnemonic.split(" ");
    let entryWord1: string = form['word1'];
    let entryWord2: string = form['word2'];
    let entryWord3: string = form['word3'];
    let entryWord4: string = form['word4'];
    let res: Boolean = true;
    if(entryWord1 == mnemonic[this.word1-1]){
      res = res && true;
    }else{
      res = res && false;
    }

    if(entryWord2 == mnemonic[this.word2-1]){
      res = res && true;
    }else{
      res = res && false;
    }

    if(entryWord3 == mnemonic[this.word3-1]){
      res = res && true;
    }else{
      res = res && false;
    }

    if(entryWord4 == mnemonic[this.word4-1]){
      res = res && true;
    }else{
      res = res && false;
    }
    return res;
  }

  onSubmit(form: any) {
    let verification = this.verifyMnemonic(form);
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
    let key = "privateKey_"+this.count;
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

  verifyPasswordOpenDialog() {
    let appStorage = new AppStorage(this.obfuscateKey);
    let passwordDialog = this.dialog.open(VerifyPasswordComponent,{
      width: '230px',
      disableClose: true,
    });
    passwordDialog.afterClosed().subscribe(async (result: any) => {
      this.obfuscateKey = result;
      await this.savePrivKey();
      await this.saveWallet();
      await this.createAddressBook();
      AppStorage.setItem("count",this.count);
      this.router.navigateByUrl('balance');
    });
  }

  async createAddressBook() {
    let appStorage = new AppStorage(this.obfuscateKey);
    let hasBook = await AppStorage.hasItem("address_book");
    if(hasBook) {
      let addressBook = await appStorage.loadItemFromStorage("address_book").then((addrs: any) => {
        this.addressBook = addrs
      })
      this.addressBook.push({
        'name': this.walletName,
        'index': 'wallet_'+this.count,
        'keyIndex': 'privateKey_'+this.count,
      })
    } else {
      this.addressBook = [];
      this.addressBook.push({
        'name': this.walletName,
        'index': 'wallet_'+this.count,
        'keyIndex': 'privateKey_'+this.count,
      })
    }
    appStorage.saveItemToStorage("address_book", this.addressBook);
  }

  getRandomValue(): string {
    let array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array.toString();
  }
}
