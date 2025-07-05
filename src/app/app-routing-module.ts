import { Routes } from '@angular/router';
import { StockComponent } from './components/stock/stock';
import { InterestComponent } from './components/interest/interest';
import { DividendComponent } from './components/dividend/dividend';
import { TransactionComponent } from './components/transaction/transaction';

export const routes: Routes = [
  { path: 'stocks', component: StockComponent },
  { path: 'interests', component: InterestComponent },
  { path: 'dividends', component: DividendComponent },
  { path: 'transactions', component: TransactionComponent },
  { path: '', redirectTo: '/stocks', pathMatch: 'full' }
];