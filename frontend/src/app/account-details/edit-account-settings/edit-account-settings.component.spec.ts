import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { EditAccountSettingsComponent } from './edit-account-settings.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditAccountSettingsComponent', () => {
  let component: EditAccountSettingsComponent;
  let fixture: ComponentFixture<EditAccountSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Adds the RouterTestingModule dependency
      imports: [RouterTestingModule],
      declarations: [ EditAccountSettingsComponent ],
      // Adds FormBuilder dependency
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
