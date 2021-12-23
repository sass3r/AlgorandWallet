import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router, NavigationEnd } from '@angular/router';
import {MultisignConfirmComponent} from '../multisign-confirm/multisign-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { CommunicationService } from '../services/communication.service';
import { MultisigMetadata } from 'algosdk';
import algosdk from 'algosdk';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-import-multisign',
  templateUrl: './import-multisign.component.html',
  styleUrls: ['./import-multisign.component.scss']
})
export class ImportMultisignComponent implements OnInit {
  private obfuscateKey: string;
  multisignForm: FormGroup;
  wallet: any
  count: any;
  errorMessage: string;
  walletAddress: string;
  multisignAddress: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private communicationService: CommunicationService,
  ) { 
    this.multisignForm = this.formBuilder.group({
      'name': ['',[Validators.required]],
      'shared_secret': ['',[Validators.required]],
    });
    this.wallet = {};
    this.obfuscateKey = "";
    this.count = "0";
    this.errorMessage = "";
    this.multisignAddress = "";
    this.walletAddress = "";
  }

  async ngOnInit() {
    this.count = await AppStorage.getItem("count");
    let id = parseInt(this.count) + 1
    this.count = id.toString();
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "setWallet") {
        this.walletAddress = change.msg.address;
        this.wallet = change.msg;
      }
    });
    this.communicationService.emitChange({topic: 'getWallet'});
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (event.id === 1 && event.url === event.urlAfterRedirects) {
        this.router.navigateByUrl('connect');
      }
    });
  }

  validateForm(): Boolean {
    let mParams = JSON.parse(atob(this.getSharedSecret()));
    let indexWallet = mParams.addrs.indexOf(this.walletAddress);
    let validSecret = indexWallet != -1
    console.log("valid secret: ", validSecret);
    return this.multisignForm.valid && validSecret; 
  }


  onSubmit(form: any) {
    if(this.validateForm()){
      console.log(form);
      this.generateMultisignatureAccount();
    }
  }

  getNameForm(): FormArray {
    return this.multisignForm.get('name') as FormArray;
  }

  getSharedSecretForm(): FormArray {
    return this.multisignForm.get('shared_secret') as FormArray;
  }

  getNameWallet(): string {
    return this.multisignForm.value['name'];
  }

  getSharedSecret(): string {
    return this.multisignForm.value['shared_secret'];
  }

  generateMultisignatureAccount() {
    let mParams = JSON.parse(atob(this.getSharedSecret()));
    console.log("MultiSig params", mParams);
    this.multisignAddress = algosdk.multisigAddress(mParams);
    this.confirmMultisigOpenDialog(mParams);
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
      AppStorage.setItem("count",this.count);
      await this.saveWallet();
      this.router.navigateByUrl('balance');
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

}
