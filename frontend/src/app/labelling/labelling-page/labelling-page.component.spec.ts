import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabellingPageComponent } from './labelling-page.component';

describe('LabellingPageComponent', () => {
  let component: LabellingPageComponent;
  let fixture: ComponentFixture<LabellingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabellingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabellingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
