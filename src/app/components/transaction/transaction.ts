import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TransactionDialogComponent } from '../transaction-dialog/transaction-dialog';
import { StockService } from '../../services/stock';
import { Stock } from '../../models/stock';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.html',
  styleUrls: ['./transaction.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatSelectModule, FormsModule],
})
export class TransactionComponent implements OnInit {

  displayedColumns: string[] = ['transactionDate', 'stock', 'transactionType', 'price', 'units', 'currency', 'cost', 'actions'];
  dataSource!: MatTableDataSource<Transaction>;
  allTransactions: Transaction[] = []; // Store all transactions
  stocks: Stock[] = [];
  selectedStockTicker: string = 'all'; // Default to show all stocks

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private transactionService: TransactionService,
    private stockService: StockService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadTransactions();
    this.stockService.getStocks().subscribe(data => {
      this.stocks = data.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe(data => {
      this.allTransactions = data; // Store all transactions
      this.applyStockFilter(); // Apply filter after loading
    });
  }

  applyStockFilter() {
    let filteredTransactions = this.allTransactions;
    if (this.selectedStockTicker !== 'all') {
      filteredTransactions = this.allTransactions.filter(transaction => transaction.stock.ticker === this.selectedStockTicker);
    }
    this.dataSource = new MatTableDataSource(filteredTransactions);
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.sort = this.sort;
  }

  openDialog(transaction?: Transaction): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '400px',
      data: { transaction: transaction, stocks: this.stocks }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.transactionService.updateTransaction(result.id, result).subscribe(() => {
            this.loadTransactions();
          });
        } else {
          this.transactionService.addTransaction(result).subscribe(() => {
            this.loadTransactions();
          });
        }
      }
    });
  }

  deleteTransaction(id: number): void {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(() => {
        this.loadTransactions();
      });
    }
  }

  private sortingDataAccessor(item: Transaction, property: string) {
    switch (property) {
      case 'stock': return item.stock.name;
      default: return (item as any)[property];
    }
  }
}