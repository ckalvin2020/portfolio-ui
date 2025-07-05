import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Interest } from '../../models/interest';
import { InterestService } from '../../services/interest';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { InterestDialogComponent } from '../interest-dialog/interest-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.html',
  styleUrls: ['./interest.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatButtonModule, MatIconModule, MatSelectModule, FormsModule],
})
export class InterestComponent implements OnInit {

  displayedColumns: string[] = ['interestDate', 'interestAmount', 'broker', 'currency', 'actions'];
  dataSource!: MatTableDataSource<Interest>;
  allInterests: Interest[] = []; // Store all interests
  selectedBroker: string = 'all'; // Default to show all brokers

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private interestService: InterestService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadInterests();
  }

  loadInterests() {
    this.interestService.getInterests().subscribe(data => {
      this.allInterests = data; // Store all interests
      this.applyBrokerFilter(); // Apply filter after loading
    });
  }

  applyBrokerFilter() {
    let filteredInterests = this.allInterests;
    if (this.selectedBroker !== 'all') {
      filteredInterests = this.allInterests.filter(interest => interest.broker === this.selectedBroker);
    }
    this.dataSource = new MatTableDataSource(filteredInterests);
    this.dataSource.sort = this.sort;
  }

  openDialog(interest?: Interest): void {
    const dialogRef = this.dialog.open(InterestDialogComponent, {
      width: '400px',
      data: { interest: interest }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.interestService.updateInterest(result.id, result).subscribe(() => {
            this.loadInterests();
          });
        } else {
          this.interestService.addInterest(result).subscribe(() => {
            this.loadInterests();
          });
        }
      }
    });
  }

  deleteInterest(id: number): void {
    if (confirm('Are you sure you want to delete this interest?')) {
      this.interestService.deleteInterest(id).subscribe(() => {
        this.loadInterests();
      });
    }
  }
}