import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisignConfirmComponent } from './multisign-confirm.component';

describe('MultisignConfirmComponent', () => {
  let component: MultisignConfirmComponent;
  let fixture: ComponentFixture<MultisignConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultisignConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisignConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
