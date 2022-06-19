import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastGlobalComponent } from 'app/modals/toast-global/toast-global.component';

describe('ToastGlobalComponent', () => {
  let component: ToastGlobalComponent;
  let fixture: ComponentFixture<ToastGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToastGlobalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
