import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BravoCalculatorComponent } from './bravo-calculator.component';

describe('BravoCalculatorComponent', () => {
  let component: BravoCalculatorComponent;
  let fixture: ComponentFixture<BravoCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BravoCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BravoCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
