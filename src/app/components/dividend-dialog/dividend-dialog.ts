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
import { Dividend } from '../../models/dividend';
import { DividendRequestPayload } from '../../models/dividend-request-payload';
import { Stock } from '../../models/stock';
import { StockService } from '../../services/stock';

@Component({
  selector: 'app-dividend-dialog',
  templateUrl: './dividend-dialog.html',
  styleUrls: ['./dividend-dialog.scss'],
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
export class DividendDialogComponent implements OnInit {
  dividendForm: FormGroup;
  stocks: Stock[] = [];

  constructor(
    public dialogRef: MatDialogRef<DividendDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dividend?: Dividend, stocks: Stock[] },
    private fb: FormBuilder,
    private stockService: StockService,
    private datePipe: DatePipe
  ) {
    this.stocks = data.stocks;
    this.dividendForm = this.fb.group({
      stock: [data.dividend?.stock?.ticker, Validators.required],
      dividendDate: [data.dividend?.dividendDate ? new Date(data.dividend.dividendDate) : null, Validators.required],
      units: [data.dividend?.units, [Validators.required, Validators.min(1)]],
      dividendPerShare: [data.dividend?.dividendPerShare, [Validators.required, Validators.min(0)]],
      currency: [data.dividend?.currency, Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSave(): void {
    if (this.dividendForm.valid) {
      const formValue = this.dividendForm.value;
      const dividendToSave: Dividend = {
        id: this.data.dividend?.id, // Keep the ID if it's an edit operation
        stock: this.stocks.find(s => s.ticker === formValue.stock) as Stock, // Find the full stock object
        dividendDate: formValue.dividendDate, // Keep as Date object
        units: formValue.units,
        dividendPerShare: formValue.dividendPerShare,
        totalDividend: 0, // This will be calculated by the backend
        currency: formValue.currency
      };
      console.log('Dividend to save:', dividendToSave);
      this.dialogRef.close({ dividend: dividendToSave, id: this.data.dividend?.id });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}