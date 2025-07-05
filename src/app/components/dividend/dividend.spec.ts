import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dividend } from './dividend';

describe('Dividend', () => {
  let component: Dividend;
  let fixture: ComponentFixture<Dividend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Dividend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dividend);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
