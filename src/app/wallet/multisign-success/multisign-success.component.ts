import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-multisign-success',
  templateUrl: './multisign-success.component.html',
  styleUrls: ['./multisign-success.component.scss']
})
export class MultisignSuccessComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<MultisignSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MultisignPayload,
  ) { }

  ngOnInit(): void {
  }

}

export interface MultisignPayload {
  address: string;
  sharedSecret: string;
}
