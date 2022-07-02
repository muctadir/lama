import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ThemeVisualComponent } from './theme-visual.component';

describe('ThemeVisualComponent', () => {
  let component: ThemeVisualComponent;
  let fixture: ComponentFixture<ThemeVisualComponent>;
  let router: Router

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeVisualComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
    router = TestBed.inject(Router)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
