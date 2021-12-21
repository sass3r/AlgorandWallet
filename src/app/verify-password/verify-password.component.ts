import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import AppStorage from "@randlabs/encrypted-local-storage";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { verify } from 'crypto';


@Component({
  selector: 'app-verify-password',
  templateUrl: './verify-password.component.html',
  styleUrls: ['./verify-password.component.scss']
})
export class VerifyPasswordComponent implements OnInit {

  private obfuscateKey: string;
  private paswordKey: string;
  verifyForm: FormGroup;
  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<VerifyPasswordComponent>,
    private formBuilder: FormBuilder
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
      console.log('invalid password');
      console.log(e);
    })
  }

  async onSubmit(form: any) {
    let password = form['password'];
    console.log(password);
    await this.verify(password);
  }

  getPasswordForm(): FormArray {
    return this.verifyForm.get('password') as FormArray;
  } 

}
