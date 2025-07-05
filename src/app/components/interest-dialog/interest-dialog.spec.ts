import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestDialog } from './interest-dialog';

describe('InterestDialog', () => {
  let component: InterestDialog;
  let fixture: ComponentFixture<InterestDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
