import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Stock } from '../../models/stock';
import { StockService } from '../../services/stock';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.html',
  styleUrls: ['./stock.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
})
export class StockComponent implements OnInit {

  displayedColumns: string[] = ['ticker', 'name'];
  dataSource!: MatTableDataSource<Stock>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private stockService: StockService) { }

  ngOnInit() {
    this.stockService.getStocks().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }
}