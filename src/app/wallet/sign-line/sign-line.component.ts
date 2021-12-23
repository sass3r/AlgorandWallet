import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-sign-line',
  templateUrl: './sign-line.component.html',
  styleUrls: ['./sign-line.component.scss']
})
export class SignLineComponent implements OnInit {

  signForm: FormGroup;
  errorMessage: string;
  @Input() id: number;
  @Output() addressChanged: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private communicationService: CommunicationService
  ) {
    this.id = 0;
    this.errorMessage = "";
    this.signForm = this.formBuilder.group({
      'address': ['',[Validators.required]],
    });
   }

  ngOnInit(): void {
  }

  getAddressForm(): FormArray {
    return this.signForm.get('address') as FormArray;
  }
  
  addressChange(event: any) {
    this.addressChanged.emit(event.target.value);
  }

}
