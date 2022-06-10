import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUsersModalComponent } from './add-users-modal.component';

describe('AddUsersModalComponent', () => {
  let component: AddUsersModalComponent;
  let fixture: ComponentFixture<AddUsersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUsersModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUsersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
