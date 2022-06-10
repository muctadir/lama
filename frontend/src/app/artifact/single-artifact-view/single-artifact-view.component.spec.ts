import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleArtifactViewComponent } from './single-artifact-view.component';

describe('SingleArtifactViewComponent', () => {
  let component: SingleArtifactViewComponent;
  let fixture: ComponentFixture<SingleArtifactViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleArtifactViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleArtifactViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
