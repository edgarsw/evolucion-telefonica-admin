import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToolbarToken } from './theme/tokens';
import { ImageModule } from 'primeng/image';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    PanelMenuModule,
    RouterModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    ImageModule,
    MenuModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  ToolbarToken = ToolbarToken;
  sidebarVisible = true;
  userMenuOpen = false;

  menu = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Clientes', icon: 'pi pi-users', routerLink: '/' },
    {
      label: 'Documents',
      items: [
        {
          label: 'New',
          icon: 'pi pi-plus',
        },
        {
          label: 'Search',
          icon: 'pi pi-search',
        }
      ]
    },
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  onLogout() {
    console.log('Cerrar sesión');
  }
}
