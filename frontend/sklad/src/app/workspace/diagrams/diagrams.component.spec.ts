import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramsComponent } from './diagrams.component';

describe('DiagramsComponent', () => {
  let component: DiagramsComponent;
  let fixture: ComponentFixture<DiagramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
