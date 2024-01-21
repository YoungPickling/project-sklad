import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirNavElementComponent } from './dir-nav.component';

describe('DirNavComponent', () => {
  let component: DirNavElementComponent;
  let fixture: ComponentFixture<DirNavElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirNavElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirNavElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
