import { TestBed } from '@angular/core/testing';

import { BravoCalculatorService } from './bravo-calculator.service';

describe('BravoCalculatorService', () => {
  let service: BravoCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BravoCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
