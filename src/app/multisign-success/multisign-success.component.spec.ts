import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisignSuccessComponent } from './multisign-success.component';

describe('MultisignSuccessComponent', () => {
  let component: MultisignSuccessComponent;
  let fixture: ComponentFixture<MultisignSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultisignSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisignSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
