
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Interest } from '../../models/interest';
import { InterestRequestPayload } from '../../models/interest-request-payload';

@Component({
  selector: 'app-interest-dialog',
  templateUrl: './interest-dialog.html',
  styleUrls: ['./interest-dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [DatePipe]
})
export class InterestDialogComponent implements OnInit {
  interestForm: FormGroup;
  brokers: string[] = ['MOOMOO', 'MAYBANK'];
  currencies: string[] = ['MYR', 'USD'];

  constructor(
    public dialogRef: MatDialogRef<InterestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { interest?: Interest },
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.interestForm = this.fb.group({
      id: [data.interest?.id],
      interestDate: [data.interest?.interestDate ? new Date(data.interest.interestDate) : null, Validators.required],
      interestAmount: [data.interest?.interestAmount, [Validators.required, Validators.min(0)]],
      broker: [data.interest?.broker, Validators.required],
      currency: [data.interest?.currency, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSave(): void {
    if (this.interestForm.valid) {
      const formValue = this.interestForm.value;
      const interestToSave: Interest = {
        id: formValue.id,
        interestDate: formValue.interestDate, // Keep as Date object
        interestAmount: formValue.interestAmount,
        broker: formValue.broker,
        currency: formValue.currency
      };

      // Remove id if it's a new interest
      if (!interestToSave.id) {
        delete interestToSave.id;
      }
      console.log('Interest to save:', interestToSave);
      this.dialogRef.close(interestToSave);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
