import { Routes } from '@angular/router';
import { LoginView } from './views/login-view/login-view';
import { ClientesComponent } from './views/clientes-view/clientes';
import { AppLayoutView } from './views/app-layout-view/app-layout-view';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'clientes' },
  { path: 'login', component: LoginView, title: 'Login' },
  {
    path: '',
    component: AppLayoutView,
    children: [
      { path: 'clientes', component: ClientesComponent, title: 'Clientes' },
      { path: '**', redirectTo: 'clientes' }
    ]
  }
];
