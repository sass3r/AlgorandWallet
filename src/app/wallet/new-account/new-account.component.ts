import { Component, OnInit, ɵisObservable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import AppStorage from "@randlabs/encrypted-local-storage";
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.scss']
})

export class NewAccountComponent implements OnInit {
  accountForm: FormGroup;
  errorMessage: string;
  passwordKey: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public dialogRef: MatDialogRef<NewAccountComponent>,
  ) { 
    this.errorMessage = "Revise el formulario";
    this.passwordKey = "masterKey";
    this.accountForm = this.formBuilder.group({
      'password': ['',[Validators.required]],
      'confirm': ['',[Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  getPasswordForm(): FormArray {
    return this.accountForm.get('password') as FormArray;
  } 

  getConfirmForm(): FormArray {
    return this.accountForm.get('confirm') as FormArray;
  } 

  async onSubmit(form: any) {
    if(this.accountForm.valid){
      let password = form['password'];
      console.log(password);
      console.log(this.passwordKey);
      await AppStorage.createPassword(this.passwordKey, password)
      .then(() => {
        console.log('success');
        this.dialogRef.close(true);
        this.router.navigateByUrl('display-options');
      })
      .catch(e => {
        console.log(e);
      })
   }
  }

}
