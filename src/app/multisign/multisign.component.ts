import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import * as algosdk from 'algosdk';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router, NavigationEnd } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { filter } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {MultisignConfirmComponent} from '../multisign-confirm/multisign-confirm.component';
import {MultisignSuccessComponent} from '../multisign-success/multisign-success.component';
import { MultisigMetadata } from 'algosdk';

@Component({
  selector: 'app-multisign',
  templateUrl: './multisign.component.html',
  styleUrls: ['./multisign.component.scss']
})
export class MultisignComponent implements OnInit {
  private obfuscateKey: string;
  multisignAddress: string;
  sharedSecret: string;
  multisignForm: FormGroup;
  cosignersNum: number;
  signersNum: number;
  errorMessage: string;
  walletAddress: string;
  wallet: any
  signers: Array<string>;
  count: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private communicationService: CommunicationService,
    private dialog: MatDialog,
  ) {
    this.cosignersNum = 10;
    this.signersNum = 1;
    this.errorMessage = "";
    this.walletAddress = "";
    this.wallet = {};
    this.obfuscateKey = "";
    this.count = "0";
    this.multisignForm = this.formBuilder.group({
      'name': ['',[Validators.required]],
      'co_signers': ['',[Validators.required]],
      'signers': ['',[Validators.required]],
      'signer_address': ['',[Validators.required]]
    });
    this.signers = [];
    this.multisignAddress = "";
    this.sharedSecret = "";
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
      if(change.topic == "setWallet") {
        this.walletAddress = change.msg.address;
        this.wallet = change.msg;
        this.signers.push(this.walletAddress);
        this.multisignForm.controls['signer_address'].setValue(this.walletAddress);
      }
    });
    this.communicationService.emitChange({topic: 'getWallet'});
  }

  genArray(len: number): Array<number> {
    return Array.from({length: len}, (x, i) => i+1);
  }

  range(start: number, end: number) {
    let ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans; 
  }

  validateForm(): Boolean {
    let validSigners = this.signers.length == this.getCosignersNum(); 
    return this.multisignForm.valid && validSigners; 
  }

  onSubmit(form: any) {
    if(this.validateForm()){
      console.log(form);
      this.generateMultisignatureAccount();
    }
  }

  generateMultisignatureAccount() {
    console.log(this.signers);
    let mParams = {
      version: 1,
      threshold: this.getsignersNum(),
      addrs: this.signers
    }
    this.multisignAddress = algosdk.multisigAddress(mParams);
    let paramsJson = JSON.stringify(mParams);
    console.log("params", paramsJson);
    this.sharedSecret = btoa(paramsJson)
    console.log("base64", this.sharedSecret);
    this.confirmMultisigOpenDialog(mParams);
  }

  getNameWallet(): string {
    return this.multisignForm.value['name'];
  }

  getCoSignersForm(): FormArray {
    return this.multisignForm.get('co_signers') as FormArray;
  }

  getNameForm(): FormArray {
    return this.multisignForm.get('name') as FormArray;
  }

  getSignersForm(): FormArray {
    return this.multisignForm.get('signers') as FormArray;
  }

  getSignerAddressForm(): FormArray {
    return this.multisignForm.get('signer_address') as FormArray;
  }

  getCosignersNum(): number {
    return this.multisignForm.value['co_signers'];
  }

  getsignersNum(): number {
    return this.multisignForm.value['signers'];
  }

  getWalletLabel() {
    let signers = this.getsignersNum();
    let cosigners = this.getCosignersNum();
    return signers + "-" + cosigners;
  }

  addSigner(address: string) {
    console.log(address);
    this.signers.push(address);
  }

  confirmMultisigOpenDialog(multisigMetadata: MultisigMetadata) {
    let multisigDialog = this.dialog.open(MultisignConfirmComponent,{
      width: '600px',
      disableClose: true,
      data: multisigMetadata,
    });
    multisigDialog.afterClosed().subscribe(async (result: any) => {
      this.obfuscateKey = result;
      console.log(this.obfuscateKey);
      await this.saveWallet();
      this.multisigSuccessOpenDialog();
    });
  }

  async saveWallet() {
    let key =  "wallet_"+this.count;
    let appStorage = new AppStorage(this.obfuscateKey);
    let obj = {
      name: this.getNameWallet(),
      address: this.multisignAddress,
      mnemonic: this.wallet.mnemonic,
      multisign: true
    };
    console.log("obj multisign", obj);
    await appStorage.saveItemToStorage(key,obj)
    .catch(e => {
      console.log("fail to store wallet");
      console.log(e);
    });
  }


  multisigSuccessOpenDialog() {
    let multisigDialog = this.dialog.open(MultisignSuccessComponent,{
      width: '600px',
      data: {
        address: this.multisignAddress,
        sharedSecret: this.sharedSecret
      },
    });
    multisigDialog.afterClosed().subscribe(async (result: any) => {
      this.router.navigateByUrl('balance');
    });
  }

}
