import { Routes } from '@angular/router';
import { LoginView } from './views/login-view/login-view';
import { ClientesComponent } from './views/clients-view/clients-view';
import { AppLayoutView } from './views/app-layout-view/app-layout-view';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'clientes' },
  { path: 'login', component: LoginView, title: 'Login', canActivate: [loginGuard] },
  {
    path: '',
    component: AppLayoutView,
    children: [
      { path: 'clientes', component: ClientesComponent, title: 'Clientes', canActivate: [authGuard] },
      { path: '**', redirectTo: 'clientes' }
    ]
  }
];
