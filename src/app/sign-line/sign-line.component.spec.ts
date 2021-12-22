import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignLineComponent } from './sign-line.component';

describe('SignLineComponent', () => {
  let component: SignLineComponent;
  let fixture: ComponentFixture<SignLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
