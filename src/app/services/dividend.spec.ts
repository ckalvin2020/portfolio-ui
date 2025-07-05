import { TestBed } from '@angular/core/testing';

import { Dividend } from './dividend';

describe('Dividend', () => {
  let service: Dividend;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dividend);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
