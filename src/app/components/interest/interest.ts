import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Interest } from '../../models/interest';
import { InterestService } from '../../services/interest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.html',
  styleUrls: ['./interest.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
})
export class InterestComponent implements OnInit {

  displayedColumns: string[] = ['interestDate', 'interestAmount', 'broker', 'currency'];
  dataSource!: MatTableDataSource<Interest>;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private interestService: InterestService) { }

  ngOnInit() {
    this.interestService.getInterests().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }
}