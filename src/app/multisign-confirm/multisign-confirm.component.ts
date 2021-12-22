import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import AppStorage from "@randlabs/encrypted-local-storage";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MultisigMetadata } from 'algosdk';

@Component({
  selector: 'app-multisign-confirm',
  templateUrl: './multisign-confirm.component.html',
  styleUrls: ['./multisign-confirm.component.scss']
})
export class MultisignConfirmComponent implements OnInit {

  private obfuscateKey: string;
  private paswordKey: string;
  verifyForm: FormGroup;
  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<MultisignConfirmComponent>,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: MultisigMetadata,
  ) { 
    this.obfuscateKey = "";
    this.paswordKey = "masterKey";
    this.verifyForm = this.formBuilder.group({
      'password': ['',[Validators.required]]
    });
    this.errorMessage = "";
  }

  ngOnInit(): void {
  }

  async verify(password: string) {
    let obfuscateKey = await AppStorage.verifyPassword(this.paswordKey,password)
    .then((key) =>{
      this.dialogRef.close(key);
    })
    .catch(e => {
      this.toastr.error('Contraseña incorrecta'); 
    })
  }

  async onSubmit(form: any) {
    let password = form['password'];
    await this.verify(password);
  }

  getPasswordForm(): FormArray {
    return this.verifyForm.get('password') as FormArray;
  } 

  getCoSignersNum(): number {
    let params = this.data;
    let addrs = params.addrs; 
    return addrs.length;
  }

  getSignersNum(): number {
    return this.data.threshold;
  }

}