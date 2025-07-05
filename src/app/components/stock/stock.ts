
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Stock } from '../../models/stock';
import { StockService } from '../../services/stock';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { StockDialogComponent } from '../stock-dialog/stock-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.html',
  styleUrls: ['./stock.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule],
})
export class StockComponent implements OnInit {

  displayedColumns: string[] = ['ticker', 'name', 'baseCurrency', 'actions'];
  dataSource!: MatTableDataSource<Stock>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private stockService: StockService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadStocks();
  }

  loadStocks() {
    this.stockService.getStocks().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(stock?: Stock): void {
    const dialogRef = this.dialog.open(StockDialogComponent, {
      width: '400px',
      data: { stock: stock }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { stock: updatedStock, originalTicker } = result;
        if (originalTicker) {
          this.stockService.updateStock(originalTicker, updatedStock).subscribe(() => {
            this.loadStocks();
          });
        } else {
          this.stockService.addStock(updatedStock).subscribe(() => {
            this.loadStocks();
          });
        }
      }
    });
  }

  deleteStock(ticker: string): void {
    if (confirm('Are you sure you want to delete this stock?')) {
      this.stockService.deleteStock(ticker).subscribe(() => {
        this.loadStocks();
      });
    }
  }
}
