import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Stock } from '../../models/stock';
import { StockRequestPayload } from '../../models/stock-request-payload';

@Component({
  selector: 'app-stock-dialog',
  templateUrl: './stock-dialog.html',
  styleUrls: ['./stock-dialog.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class StockDialogComponent implements OnInit {
  stockForm: FormGroup;
  currencies: string[] = ['MYR', 'USD'];

  constructor(
    public dialogRef: MatDialogRef<StockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { stock?: Stock },
    private fb: FormBuilder
  ) {
    this.stockForm = this.fb.group({
      ticker: [data.stock?.ticker, Validators.required],
      name: [data.stock?.name, Validators.required],
      baseCurrency: [data.stock?.baseCurrency, Validators.required]
    });

    // Disable ticker field if editing existing stock
    if (data.stock?.ticker) {
      this.stockForm.controls['ticker'].disable();
    }
  }

  ngOnInit(): void {
  }

  onSave(): void {
    if (this.stockForm.valid) {
      const formValue = this.stockForm.getRawValue(); // Use getRawValue to get disabled field value
      const stockToSave: StockRequestPayload = {
        ticker: formValue.ticker,
        name: formValue.name,
        baseCurrency: formValue.baseCurrency
      };
      console.log('Stock to save:', stockToSave);
      this.dialogRef.close({ stock: stockToSave, originalTicker: this.data.stock?.ticker });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}