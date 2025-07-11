import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioReport } from './portfolio-report';

describe('PortfolioReport', () => {
  let component: PortfolioReport;
  let fixture: ComponentFixture<PortfolioReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
