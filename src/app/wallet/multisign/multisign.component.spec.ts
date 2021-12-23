import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultisignComponent } from './multisign.component';

describe('MultisignComponent', () => {
  let component: MultisignComponent;
  let fixture: ComponentFixture<MultisignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultisignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultisignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
