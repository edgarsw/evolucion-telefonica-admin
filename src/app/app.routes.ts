import { Routes } from '@angular/router';
import { ClientesComponent } from './views/clientes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'clientes' },
  { path: 'clientes', component: ClientesComponent }
];