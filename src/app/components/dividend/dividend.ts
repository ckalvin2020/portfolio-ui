import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Dividend } from '../../models/dividend';
import { DividendService } from '../../services/dividend';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DividendDialogComponent } from '../dividend-dialog/dividend-dialog';
import { StockService } from '../../services/stock';
import { Stock } from '../../models/stock';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dividend',
  templateUrl: './dividend.html',
  styleUrls: ['./dividend.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatSelectModule, FormsModule],
})
export class DividendComponent implements OnInit {

  displayedColumns: string[] = ['dividendDate', 'stock', 'units', 'dividendPerShare', 'totalDividend', 'currency', 'actions'];
  dataSource!: MatTableDataSource<Dividend>;
  allDividends: Dividend[] = []; // Store all dividends
  stocks: Stock[] = [];
  selectedStockTicker: string = 'all'; // Default to show all stocks

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dividendService: DividendService,
    private stockService: StockService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadDividends();
    this.stockService.getStocks().subscribe(data => {
      this.stocks = data.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  loadDividends() {
    this.dividendService.getDividends().subscribe(data => {
      this.allDividends = data; // Store all dividends
      this.applyStockFilter(); // Apply filter after loading
    });
  }

  applyStockFilter() {
    let filteredDividends = this.allDividends;
    if (this.selectedStockTicker !== 'all') {
      filteredDividends = this.allDividends.filter(dividend => dividend.stock.ticker === this.selectedStockTicker);
    }
    this.dataSource = new MatTableDataSource(filteredDividends);
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.sort = this.sort;
  }

  openDialog(dividend?: Dividend): void {
    const dialogRef = this.dialog.open(DividendDialogComponent, {
      width: '400px',
      data: { dividend: dividend, stocks: this.stocks }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { dividend: updatedDividend, id: originalId } = result;
        if (originalId !== undefined && originalId !== null) {
          this.dividendService.updateDividend(originalId, updatedDividend as any).subscribe(() => {
            this.loadDividends();
          });
        } else {
          this.dividendService.addDividend(updatedDividend as any).subscribe(() => {
            this.loadDividends();
          });
        }
      }
    });
  }

  deleteDividend(id: number): void {
    if (confirm('Are you sure you want to delete this dividend?')) {
      this.dividendService.deleteDividend(id).subscribe(() => {
        this.loadDividends();
      });
    }
  }

  private sortingDataAccessor(item: Dividend, property: string) {
    switch (property) {
      case 'stock': return item.stock.name;
      default: return (item as any)[property];
    }
  }
}