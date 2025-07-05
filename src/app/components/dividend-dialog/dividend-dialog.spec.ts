import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividendDialog } from './dividend-dialog';

describe('DividendDialog', () => {
  let component: DividendDialog;
  let fixture: ComponentFixture<DividendDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividendDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividendDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
