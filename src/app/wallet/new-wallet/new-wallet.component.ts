import { Component, OnInit } from '@angular/core';
import * as algosdk from 'algosdk';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router, NavigationEnd } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { filter } from 'rxjs/operators';

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
  private wallet: object;

  constructor(
    private router: Router,
    private communicationService: CommunicationService
  ) { 
    this.account = algosdk.generateAccount();
    this.address = this.account.addr;
    this.mnemonic = algosdk.secretKeyToMnemonic(this.account.sk);
    this.privateKey = this.account.sk;
    this.passwordKey = "masterKey";
    this.wallet = {};
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (event.id === 1 && event.url === event.urlAfterRedirects) {
        this.router.navigateByUrl('connect');
      }
    });
  }

  ngOnInit() {
    this.wallet = {
      'address': this.address,
      'privateKey': this.privateKey,
      'mnemonic': this.mnemonic
    };
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "getWalletData") {
        this.communicationService.emitChange({topic: 'setWalletData', msg:this.wallet});
      }
    });
  }

  regenetareAccount() {
    this.generateAccount();
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

  private generateAccount() {
    this.account = algosdk.generateAccount();
    this.address = this.account.addr;
    this.mnemonic = algosdk.secretKeyToMnemonic(this.account.sk);
    this.privateKey = this.account.sk;
    this.wallet = {
      'address': this.address,
      'privateKey': this.privateKey,
      'mnemonic': this.mnemonic
    };
  }
}
