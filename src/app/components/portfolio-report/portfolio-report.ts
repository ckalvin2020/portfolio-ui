
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { PortfolioService } from '../../services/portfolio';
import { StockService } from '../../services/stock';
import { Stock } from '../../models/stock';
import { PortfolioPerformance } from '../../models/portfolio-performance';
import { AnnualPerformance } from '../../models/annual-performance';
import { OverallPerformance } from '../../models/overall-performance';
import { YearlyPerformance } from '../../models/yearly-performance';
import { DailyPerformance } from '../../models/daily-performance';
import { StockProfitLoss } from '../../models/stock-profit-loss';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-portfolio-report',
  templateUrl: './portfolio-report.html',
  styleUrls: ['./portfolio-report.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatCardModule,
    MatExpansionModule,
    MatButtonModule,
    MatTableModule
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*', minHeight: '48px' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PortfolioReportComponent implements OnInit {

  // Filters
  selectedYear: number = new Date().getFullYear();
  selectedCurrency: string = 'MYR';
  selectedBaseCurrency: string = 'all';
  selectedYearFrom: number = new Date().getFullYear();
  selectedYearTo: number = new Date().getFullYear();
  selectedStockTicker: string = '';
  years: number[] = [];
  currencies: string[] = ['MYR', 'USD'];
  stockTickers: Stock[] = [];

  // Total Performance
  totalPortfolioPerformance: PortfolioPerformance | null = null;
  overallPerformance: OverallPerformance | null = null;

  // Portfolio Allocation Pie Chart
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      datalabels: {
        display: false, // Hide labels on the chart
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
            }
            // To show stock name in tooltip
            const stockName = context.label;
            return `${stockName}: ${label}`;
          }
        }
      }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  public costPieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }]
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [ChartDataLabels]; // Explicitly add plugin

  // Bar Chart for Stock Performance
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        display: false
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [ChartDataLabels];
  public barChartData: ChartConfiguration['data'] = {
    labels: [], // Stock names
    datasets: [
      { data: [], label: 'Current Value' },
      { data: [], label: 'Gross Profit' },
      { data: [], label: 'Net Profit' },
      { data: [], label: 'Total Dividends' }
    ]
  };
  stockPerformanceDataSource: StockProfitLoss[] = [];
  stockPerformanceDisplayedColumns: string[] = ['name', 'currentValue', 'totalCost', 'grossProfit', 'netProfit', 'totalDividends', 'peRatio', 'divYield'];
  expandedElement: StockProfitLoss | null = null;

  // Yearly Performance Bar Chart
  public yearlyBarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: {
        beginAtZero: true
      },
      'y-axis-xirr': {
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          callback: function(value, index, values) {
            return Number(value).toFixed(2) + '%';
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        display: false
      }
    }
  };
  public yearlyBarChartType: ChartType = 'bar';
  public yearlyBarChartPlugins = [ChartDataLabels];
  public yearlyBarChartData: ChartConfiguration['data'] = {
    labels: [], // Years
    datasets: [
      { data: [], label: 'Gross Profit' },
      { data: [], label: 'Net Profit' },
      { data: [], label: 'Total Dividends' },
      { data: [], label: 'Total Interest' },
      { data: [], label: 'Net Cash Flow' },
      { data: [], label: 'Yearly XIRR', type: 'line', yAxisID: 'y-axis-xirr' }
    ]
  };
  yearlyPerformanceDataSource: YearlyPerformance[] = [];
  yearlyPerformanceDisplayedColumns: string[] = ['year', 'openingValue', 'closingValue', 'grossProfit', 'netProfit', 'dividends', 'interest', 'netCashFlow', 'xirr'];

  // Annual Performance Line Chart
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Net Profit',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }
    ],
    labels: [],
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      y: {
        position: 'left',
      },
    },
    plugins: {
      datalabels: {
        display: false
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            return context[0].label; // Display the date as the title
          },
          label: function(context) {
            // This callback is called for each dataset item in the tooltip.
            // We want to aggregate all dataset values for the current point.
            // So, we'll return an empty string here and use afterBody.
            return '';
          },
          afterBody: function(tooltipItems) {
            const chart = tooltipItems[0].chart;
            const dataIndex = tooltipItems[0].dataIndex;
            const body: string[] = [];

            chart.data.datasets.forEach((dataset) => {
              const label = dataset.label || '';
              const value = dataset.data[dataIndex];
              let formattedValue = '';

              if (typeof value === 'number') {
                formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MYR' }).format(value);
              } else {
                formattedValue = String(value);
              }
              body.push(`${label}: ${formattedValue}`);
            });
            return body;
          }
        }
      }
    }
  };
  public lineChartType: ChartType = 'line';

  constructor(private portfolioService: PortfolioService, private stockService: StockService) { }

  ngOnInit(): void {
    this.generateYears();
    this.loadReportData();
    this.loadStockTickers();
  }

  generateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= currentYear - 10; i--) {
      this.years.push(i);
    }
  }

  loadStockTickers(): void {
    this.stockService.getStocks().subscribe((stocks: Stock[]) => {
      this.stockTickers = stocks.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  loadReportData(): void {
    // Load Total Portfolio Performance
    this.portfolioService.getTotalPortfolioPerformance(this.selectedCurrency, this.selectedBaseCurrency !== 'all' ? this.selectedBaseCurrency : undefined)
      .subscribe(data => {
        this.totalPortfolioPerformance = data;
        this.updatePieChart(data);
        this.updateBarChart(data);
      });

    // Load Annual Performance (Line Chart)
    // this.portfolioService.getAnnualPerformance(this.selectedYear, this.selectedCurrency, this.selectedBaseCurrency !== 'all' ? this.selectedBaseCurrency : undefined)
    //   .subscribe(data => {
    //     this.updateLineChart(data);
    //   });

    // Load Daily Performance (Line Chart)
    // const dateFrom = `${this.selectedYearFrom}-01-01`;
    // const dateTo = `${this.selectedYearTo}-12-31`;
    // this.portfolioService.getDailyPerformance(dateFrom, dateTo, this.selectedStockTicker !== 'all' ? this.selectedStockTicker : undefined, this.selectedCurrency)
    //   .subscribe(data => {
    //     this.updateLineChart(data);
    //   });

    // Load Yearly Performance (Bar Chart)
    this.portfolioService.getOverallPerformance(this.selectedCurrency, this.selectedBaseCurrency !== 'all' ? this.selectedBaseCurrency : undefined)
      .subscribe((data: OverallPerformance) => {
        this.overallPerformance = data;
        this.updateYearlyBarChart(data.yearlyPerformances);
      });
  }

  updatePieChart(data: PortfolioPerformance): void {
    const stockData: { ticker: string, currentValue: number, totalCost: number }[] = [];

    for (const ticker in data.stockPerformances) {
      if (data.stockPerformances.hasOwnProperty(ticker) && data.stockPerformances[ticker].currentValue > 0) {
        stockData.push({
          ticker: ticker,
          currentValue: data.stockPerformances[ticker].currentValue,
          totalCost: data.stockPerformances[ticker].totalCost
        });
      }
    }

    // Sort by currentValue for the first chart
    const sortedByCurrentValue = [...stockData].sort((a, b) => b.currentValue - a.currentValue);
    const currentValueLabels = sortedByCurrentValue.map(d => d.ticker);
    const currentValueData = sortedByCurrentValue.map(d => d.currentValue);

    this.pieChartData = {
      labels: currentValueLabels,
      datasets: [{ data: currentValueData }]
    };

    // Sort by totalCost for the second chart
    const sortedByTotalCost = [...stockData].sort((a, b) => b.totalCost - a.totalCost);
    const totalCostLabels = sortedByTotalCost.map(d => d.ticker);
    const totalCostData = sortedByTotalCost.map(d => d.totalCost);

    this.costPieChartData = {
      labels: totalCostLabels,
      datasets: [{ data: totalCostData }]
    };
  }

  updateBarChart(data: PortfolioPerformance): void {
    const stockData: StockProfitLoss[] = [];

    for (const stockName in data.stockPerformances) {
      const performance = data.stockPerformances[stockName];
      if (performance.currentValue > 0) { // Filter for currentValue > 0
        stockData.push({
          name: stockName,
          totalUnits: performance.totalUnits,
          totalCost: performance.totalCost,
          currentValue: performance.currentValue,
          grossProfit: performance.grossProfit,
          netProfit: performance.netProfit,
          totalDividends: performance.totalDividends,
          averageCost: performance.averageCost,
          peRatio: performance.peRatio,
          divYield: performance.divYield
        });
      }
    }

    // Sort the stock data
    stockData.sort((a, b) => {
      // Sort by currentValue (market value) descending
      if (b.currentValue !== a.currentValue) {
        return b.currentValue - a.currentValue;
      }
      // Then by grossProfit descending
      if (b.grossProfit !== a.grossProfit) {
        return b.grossProfit - a.grossProfit;
      }
      // Then by totalCost descending
      return b.totalCost - a.totalCost;
    });

    this.stockPerformanceDataSource = stockData;

    const labels = stockData.map(s => s.name);
    const currentValueData = stockData.map(s => s.currentValue);
    const grossProfitData = stockData.map(s => s.grossProfit);
    const netProfitData = stockData.map(s => s.netProfit);
    const totalDividendsData = stockData.map(s => s.totalDividends);

    this.barChartData = {
      labels: labels,
      datasets: [
        { data: currentValueData, label: 'Current Value' },
        { data: grossProfitData, label: 'Gross Profit' },
        { data: netProfitData, label: 'Net Profit' },
        { data: totalDividendsData, label: 'Total Dividends' }
      ]
    };
  }

  updateYearlyBarChart(yearlyPerformances: YearlyPerformance[]): void {
    const sortedPerformances = [...yearlyPerformances].sort((a, b) => a.year - b.year);
    this.yearlyPerformanceDataSource = sortedPerformances;

    const years = sortedPerformances.map(p => p.year.toString());
    const grossProfitData = sortedPerformances.map(p => p.grossProfit);
    const netProfitData = sortedPerformances.map(p => p.netProfit);
    const totalDividendsData = sortedPerformances.map(p => p.dividends);
    const totalInterestData = sortedPerformances.map(p => p.interest);
    const cashInflowData = sortedPerformances.map(p => p.netCashFlow);
    const yearlyXirrData = sortedPerformances.map(p => p.xirr);

    this.yearlyBarChartData = {
      labels: years,
      datasets: [
        { data: grossProfitData, label: 'Gross Profit' },
        { data: netProfitData, label: 'Net Profit' },
        { data: totalDividendsData, label: 'Total Dividends' },
        { data: totalInterestData, label: 'Total Interest' },
        { data: cashInflowData, label: 'Net Cash Flow' },
        { data: yearlyXirrData, label: 'Yearly XIRR', type: 'line', yAxisID: 'y-axis-xirr' }
      ]
    };
  }

  updateLineChart(data: DailyPerformance[]): void {
    const labels = data.map(d => d.date);
    const marketValueData = data.map(d => d.marketValue);
    const totalCostsData = data.map(d => d.totalCosts);
    const profitData = data.map(d => d.profit);
    const profitPerDayData = data.map(d => d.profitPerDay);

    this.lineChartData = {
      labels: [...labels],
      datasets: [
        {
          data: [...marketValueData],
          label: 'Market Value',
          borderColor: 'blue',
          backgroundColor: 'rgba(0,0,255,0.3)',
          fill: 'origin',
        },
        {
          data: [...totalCostsData],
          label: 'Total Costs',
          borderColor: 'red',
          backgroundColor: 'rgba(255,0,0,0.3)',
          fill: 'origin',
        },
        {
          data: [...profitData],
          label: 'Profit',
          borderColor: 'green',
          backgroundColor: 'rgba(0,255,0,0.3)',
          fill: 'origin',
        },
        {
          data: [...profitPerDayData],
          label: 'Profit Per Day',
          borderColor: 'purple',
          backgroundColor: 'rgba(128,0,128,0.3)',
          fill: 'origin',
        }
      ]
    };
  }

  loadDailyPerformance(): void {
    const dateFrom = `${this.selectedYearFrom}-01-01`;
    const dateTo = `${this.selectedYearTo}-12-31`;
    this.portfolioService.getDailyPerformance(dateFrom, dateTo, this.selectedStockTicker !== '' ? this.selectedStockTicker : undefined, this.selectedCurrency)
      .subscribe((data: DailyPerformance[]) => {
        this.updateLineChart(data);
      });
  }

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');

  toggleRow(element: StockProfitLoss) {
    this.expandedElement = this.expandedElement === element ? null : element;
  }
}
