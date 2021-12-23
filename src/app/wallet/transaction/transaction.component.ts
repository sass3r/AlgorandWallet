import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import AppStorage from "@randlabs/encrypted-local-storage";
import { VerifyPasswordComponent } from '../verify-password/verify-password.component';
import { CommunicationService } from '../services/communication.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import AlgodClient from 'algosdk/dist/types/src/client/v2/algod/algod';
import * as algosdk from 'algosdk';
import { Algodv2 } from 'algosdk';
import { filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  private obfuscateKey: string;
  private privateKey: Uint8Array;
  private passwordKey: string;
  private algodToken: string;
  private algodServer: string;
  private algodPort: string;
  private algodClient: Algodv2;
  transferForm: FormGroup;
  errorMessage: string;
  amount: number;
  receiver: string;
  note: string;
  count: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private communicationService: CommunicationService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {
    this.errorMessage = "Revise el formulario";
    this.passwordKey = "masterKey";
    this.obfuscateKey = "";
    this.amount = 0;
    this.receiver = "";
    this.note = "";
    this.count = "0";
    this.privateKey = new Uint8Array;
    this.algodToken = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    this.algodServer = 'http://200.58.83.81';
    this.algodPort = '4001';
    this.algodClient = new Algodv2(this.algodToken,this.algodServer, this.algodPort);
    this.transferForm = this.formBuilder.group({
      'amount': ['',[Validators.required]],
      'address': ['',[Validators.required]],
      'note': ['',[Validators.required]],
    });
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
  }

  onSubmit(form: any) {
    this.amount = form['amount'];
    this.receiver = form['address'];
    this.note = form['note'];
    this.verifyPasswordOpenDialog();
  }

  async transferFunds() {
    let walletKey = 'wallet_'+this.count;
    console.log(this.obfuscateKey);
    let appStorage = new AppStorage(this.obfuscateKey);
    let wallet = await appStorage.loadItemFromStorage(walletKey);
    let sender = wallet.address;
    console.log("sender: ", sender);
    let data = await AppStorage.loadPrivatekeyFromStorage('privateKey_'+this.count, this.passwordKey);
    this.privateKey = Buffer.from(data);
    console.log('PrivateKey: ', this.privateKey);
    let params = await this.algodClient.getTransactionParams().do();
    params.fee = 1000;
    params.flatFee = true;
    let enc = new TextEncoder();
    let note = enc.encode(this.note);
    let txn = algosdk.makePaymentTxnWithSuggestedParams(sender,this.receiver,this.amount, undefined, note, params);
    //Sign
    let signedTxn = txn.signTxn(this.privateKey);
    let txId = txn.txID().toString();
    console.log("Signed transaction with txID %s", txId);
    //Submit
    await this.algodClient.sendRawTransaction(signedTxn).do();
    //Wait for confirmation
    let confirmedTxn = await this.waitForConfirmation(this.algodClient,txId,4);
    this.toastr.info("Transaccion enviada con exito");
    console.log("Transaction " + txId + " confirmed in round " + confirmedTxn["confirmed-round"]);
    let string = new TextDecoder().decode(confirmedTxn['txn'].txn.note);
    console.log("Note: ", string);
    console.log("Transaction Amount: %d microAlgos", confirmedTxn['txn'].txn.amt);
    console.log("Transaction Fee: %d microAlgos", confirmedTxn['txn'].txn.fee);
    let accountInfo = await this.algodClient.accountInformation(sender).do()
    .then(info => {
      console.log(info);
    })
    .catch(e => {
      console.log(e)
    });
  }

  getAmountForm(): FormArray{
    return this.transferForm.get('amount') as FormArray;
  }

  getAddressForm(): FormArray{
    return this.transferForm.get('address') as FormArray;
  }

  getNoteForm(): FormArray{
    return this.transferForm.get('note') as FormArray;
  }

  verifyPasswordOpenDialog() {
    let passwordDialog = this.dialog.open(VerifyPasswordComponent,{
      width: '230px'
    });
    passwordDialog.afterClosed().subscribe(async (result: any) => {
      this.obfuscateKey = result;
      await this.transferFunds();
      this.router.navigateByUrl('balance');
    });
  }

  /**
 * Wait until the transaction is confirmed or rejected, or until 'timeout'
 * number of rounds have passed.
 * @param {algosdk.Algodv2} algodClient the Algod V2 client
 * @param {string} txId the transaction ID to wait for
 * @param {number} timeout maximum number of rounds to wait
 * @return {Promise<*>} pending transaction information
 * @throws Throws an error if the transaction is not confirmed or rejected in the next timeout rounds
 */
 async waitForConfirmation (algodClient: Algodv2, txId: string, timeout: number) {
  if (algodClient == null || txId == null || timeout < 0) {
      throw new Error("Bad arguments");
  }

  const status = (await algodClient.status().do());
  if (status === undefined) {
      throw new Error("Unable to get node status");
  }

  const startround = status["last-round"] + 1;
  let currentround = startround;

  while (currentround < (startround + timeout)) {
      const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
      if (pendingInfo !== undefined) {
          if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
              //Got the completed Transaction
              return pendingInfo;
          } else {
              if (pendingInfo["pool-error"] != null && pendingInfo["pool-error"].length > 0) {
                  // If there was a pool error, then the transaction has been rejected!
                  throw new Error("Transaction " + txId + " rejected - pool error: " + pendingInfo["pool-error"]);
              }
          }
      }
      await algodClient.statusAfterBlock(currentround).do();
      currentround++;
  }
  throw new Error("Transaction " + txId + " not confirmed after " + timeout + " rounds!");
};
}
