import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMultisignComponent } from './import-multisign.component';

describe('ImportMultisignComponent', () => {
  let component: ImportMultisignComponent;
  let fixture: ComponentFixture<ImportMultisignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportMultisignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMultisignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
