import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateThemeComponent } from './create-theme.component';

describe('CreateThemeComponent', () => {
  let component: CreateThemeComponent;
  let fixture: ComponentFixture<CreateThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateThemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
