import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMnemonicComponent } from './verify-mnemonic.component';

describe('VerifyMnemonicComponent', () => {
  let component: VerifyMnemonicComponent;
  let fixture: ComponentFixture<VerifyMnemonicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyMnemonicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMnemonicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
