import { Component, OnInit } from '@angular/core';
import * as algosdk from 'algosdk';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router } from '@angular/router';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.component.html',
  styleUrls: ['./new-wallet.component.scss']
})
export class NewWalletComponent implements OnInit {
  private account: algosdk.Account;
  private address: string;
  private mnemonic: string;
  private privateKey: Uint8Array;
  private passwordKey: string;

  constructor(
    private router: Router,
    private communicationService: CommunicationService
  ) { 
    this.account = algosdk.generateAccount();
    this.address = this.account.addr;
    this.mnemonic = algosdk.secretKeyToMnemonic(this.account.sk);
    this.privateKey = this.account.sk;
    this.passwordKey = "masterKey";
  }

  ngOnInit() {
    let wallet = {
      'address': this.address,
      'privateKey': this.privateKey,
      'mnemonic': this.mnemonic
    };
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "getWalletData") {
        this.communicationService.emitChange({topic: 'setWalletData', msg:wallet});
      }
    });
  }

  refresh() {
    window.location.reload();
  }

  getAddress(): string {
    return this.address;
  }

  getMnemonic(): string {
    return this.mnemonic;
  }
  
  continue() {
    this.router.navigateByUrl('verify-mnemonic');
  }
}
