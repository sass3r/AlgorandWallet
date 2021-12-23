import { Component, OnInit } from '@angular/core';
import AppStorage from "@randlabs/encrypted-local-storage";
import { CommunicationService } from '../services/communication.service';
import * as algosdk from 'algosdk';
import { Algodv2 } from 'algosdk';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  private wallet: any;
  private obfuscateKey: string;
  private walletKey: string;
  walletAddress: string;
  amount: string;
  count: any;

  constructor(
    private communicationService: CommunicationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    this.algodServer = 'http://200.58.83.81';
    this.algodPort = '4001';
    this.algodClient = new Algodv2(this.algodToken,this.algodServer, this.algodPort);
    this.wallet = {};
    this.obfuscateKey = "";
    this.amount = "";
    this.walletAddress = "";
    this.count = "0";
    this.walletKey = this.activatedRoute.snapshot.params['key'];
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
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "getWallet") {
        this.communicationService.emitChange({topic: 'setWallet', msg: this.wallet});
      }
    });
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "setObfuscateKey") {
        this.obfuscateKey = change.msg;
      }
    });
    this.communicationService.emitChange({topic: 'getObfuscateKey'});
    setInterval(()=>{
      this.getWallet();
    },1000);
  }

  async getBalance() {
    let walletAddress = this.wallet.address;
    let accountInfo = await this.algodClient.accountInformation(walletAddress).do()
    .then(info => {
      console.log(info);
      this.amount = info['amount'];
    })
    .catch(e => {
      console.log(e)
    });
  }

  async getWallet() {
    let walletKey = "";
    if(this.walletKey == undefined) {
      walletKey = 'wallet_'+this.count;
    } else {
      walletKey = this.walletKey;
    }
    console.log(this.obfuscateKey);
    let appStorage = new AppStorage(this.obfuscateKey);
    let data = await appStorage.loadItemFromStorage(walletKey)
    .then((data) => {
      console.log(data);
      this.walletAddress = data.address;
      this.wallet = data;
      this.getBalance();
    })
    .catch(e => {
      console.log(e);
    });
  }

  transfer() {
    this.router.navigateByUrl('transfer');
  }

  addWallet() {
    this.router.navigateByUrl('display-options');
  }

}
