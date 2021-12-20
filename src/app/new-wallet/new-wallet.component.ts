import { Component, OnInit } from '@angular/core';
import * as algosdk from 'algosdk';

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

  constructor() { 
    this.account = algosdk.generateAccount();
    this.address = this.account.addr;
    this.mnemonic = algosdk.secretKeyToMnemonic(this.account.sk);;
    this.privateKey = this.account.sk;
  }

  ngOnInit(): void {
    console.log(this.address);
    console.log(this.privateKey);
    console.log(this.mnemonic);
  }

  getAddress(): string {
    return this.address;
  }

  getMnemonic(): string {
    return this.mnemonic;
  }
}
