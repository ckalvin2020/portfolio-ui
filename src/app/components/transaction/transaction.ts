import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Transaction } from '../../models/transaction';
import { TransactionService } from '../../services/transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.html',
  styleUrls: ['./transaction.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
})
export class TransactionComponent implements OnInit {

  displayedColumns: string[] = ['transactionDate', 'stock', 'transactionType', 'units', 'price', 'currency'];
  dataSource!: MatTableDataSource<Transaction>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private transactionService: TransactionService) { }

  ngOnInit() {
    this.transactionService.getTransactions().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.sort = this.sort;
    });
  }

  private sortingDataAccessor(item: Transaction, property: string) {
    switch (property) {
      case 'stock': return item.stock.name;
      default: return (item as any)[property];
    }
  }
}