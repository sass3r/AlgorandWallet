import { Component, OnInit } from '@angular/core';
import AppStorage from "@randlabs/encrypted-local-storage";
import { CommunicationService } from '../services/communication.service';
import * as algosdk from 'algosdk';
import { Algodv2 } from 'algosdk';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {
  private algodToken: string;
  private algodServer: string;
  private algodPort: string;
  private algodClient: Algodv2;
  private walletAddress: string;
  private obfuscateKey: string;
  amount: string;

  constructor(
    private communicationService: CommunicationService
  ) {
    this.algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    this.algodServer = 'http://200.58.83.81';
    this.algodPort = '4001';
    this.algodClient = new Algodv2(this.algodToken,this.algodServer, this.algodPort);
    this.walletAddress = "";
    this.obfuscateKey = "";
    this.amount = "";
  }

  ngOnInit(): void {
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "setObfuscateKey") {
        this.obfuscateKey = change.msg;
      }
    });
    this.communicationService.emitChange({topic: 'getObfuscateKey'});
    this.getWallet();
  }

  async getBalance() {
    let accountInfo = await this.algodClient.accountInformation(this.walletAddress).do()
    .then(info => {
      console.log(info);
      this.amount = info['amount'];
    })
    .catch(e => {
      console.log(e)
    });
  }

  async getWallet() {
    console.log(this.obfuscateKey);
    let appStorage = new AppStorage(this.obfuscateKey);
    let data = await appStorage.loadItemFromStorage('wallet')
    .then((data) => {
      console.log(data);
      this.walletAddress = data.address;
      this.getBalance();
    })
    .catch(e => {
      console.log(e);
    });
  }

}
