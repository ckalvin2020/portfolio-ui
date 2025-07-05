
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
import { Transaction } from '../../models/transaction';
import { TransactionRequestPayload } from '../../models/transaction-request-payload';
import { Stock } from '../../models/stock';
import { StockService } from '../../services/stock';

@Component({
  selector: 'app-transaction-dialog',
  templateUrl: './transaction-dialog.html',
  styleUrls: ['./transaction-dialog.scss'],
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
export class TransactionDialogComponent implements OnInit {
  transactionForm: FormGroup;
  stocks: Stock[] = [];
  transactionTypes: string[] = ['BUY', 'SELL'];

  constructor(
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transaction?: Transaction, stocks: Stock[] },
    private fb: FormBuilder,
    private stockService: StockService,
    private datePipe: DatePipe
  ) {
    this.stocks = data.stocks;
    this.transactionForm = this.fb.group({
      id: [data.transaction?.id],
      stock: [data.transaction?.stock?.ticker, Validators.required],
      transactionDate: [data.transaction?.transactionDate ? new Date(data.transaction.transactionDate) : null, Validators.required],
      transactionType: [data.transaction?.transactionType, Validators.required],
      price: [data.transaction?.price, [Validators.required, Validators.min(0)]],
      units: [data.transaction?.units, [Validators.required, Validators.min(1)]],
      currency: [data.transaction?.currency, Validators.required],
      cost: [data.transaction?.cost]
    });
  }

  ngOnInit(): void {
  }

  onSave(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transactionToSave: Transaction = {
        id: formValue.id,
        stock: this.stocks.find(s => s.ticker === formValue.stock) as Stock,
        transactionDate: formValue.transactionDate,
        transactionType: formValue.transactionType,
        price: formValue.price,
        units: formValue.units,
        currency: formValue.currency,
        cost: formValue.cost
      };

      // Remove id if it's a new transaction
      if (!transactionToSave.id) {
        delete transactionToSave.id;
      }
      console.log('Transaction to save:', transactionToSave);
      this.dialogRef.close(transactionToSave);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
