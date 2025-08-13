import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [CommonModule, ToolbarModule, ButtonModule, PanelMenuModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  menu = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    {
      label: 'Products', icon: 'pi pi-mobile',
      items: [
        { label: 'Phones', icon: 'pi pi-phone', routerLink: '/phones' },
        { label: 'Plans', icon: 'pi pi-list', routerLink: '/plans' }
      ]
    },
    { label: 'Support', icon: 'pi pi-question-circle', routerLink: '/support' }
  ];
}
