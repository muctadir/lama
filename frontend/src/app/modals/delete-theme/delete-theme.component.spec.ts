import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteThemeComponent } from './delete-theme.component';

describe('DeleteThemeComponent', () => {
  let component: DeleteThemeComponent;
  let fixture: ComponentFixture<DeleteThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteThemeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
