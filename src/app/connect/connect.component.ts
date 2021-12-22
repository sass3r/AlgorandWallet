import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import AppStorage from "@randlabs/encrypted-local-storage";
import { NewAccountComponent } from '../new-account/new-account.component';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {
  private obfuscateKey: string;
  count: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private communicationService: CommunicationService
  ) { 
    this.obfuscateKey = "";
    this.count = "0";
  }

  async ngOnInit() {
    this.count = await AppStorage.getItem("count");
    this.communicationService.changeEmitted$.subscribe((change: any) => {
      if(change.topic == "getObfuscateKey") {
        this.communicationService.emitChange({topic: 'setObfuscateKey', msg:this.obfuscateKey});
      }
    });
    let hasPassword = await this.hasItemProperty("masterKey"); 
    if(hasPassword) {
      this.verifyPasswordOpenDialog();
    }else{
      AppStorage.setItem("count","0");
      this.newAccountOpenDialog();
    }
  }

  connect() {
    this.router.navigateByUrl('new-account');
  }

  async hasItemProperty(property: string): Promise<Boolean> {
    let hastItem = await AppStorage.hasItem(property);
    return hastItem;
  }

  verifyPasswordOpenDialog() {
    let passwordDialog = this.dialog.open(VerifyPasswordComponent,{
      width: '230px',
      disableClose: true,
    });
    passwordDialog.afterClosed().subscribe(async (result: any) => {
      let walletKey = 'wallet_'+this.count;
      this.obfuscateKey = result;
      let hasWallet = await this.hasItemProperty(walletKey);
      if(hasWallet) {
        this.router.navigateByUrl('balance');
      }else{
        this.router.navigateByUrl('display-options');
      }
    });
  }

  newAccountOpenDialog() {
    let passwordDialog = this.dialog.open(NewAccountComponent,{
      width: '230px',
      disableClose: true
    });
    passwordDialog.afterClosed().subscribe(async (result: any) => {
      this.obfuscateKey = result;
      this.router.navigateByUrl('display-options');
    });
  }
}
