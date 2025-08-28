import { Component, inject } from '@angular/core';
import { PanelMenuToken, ToolbarToken } from '../../theme/tokens';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ImageModule } from 'primeng/image';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout-view',
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
    MenuModule,
  ],
  templateUrl: './app-layout-view.html',
})
export class AppLayoutView {
  ToolbarToken = ToolbarToken;
  PanelMenuToken = PanelMenuToken;
  sidebarVisible = true;
  userMenuOpen = false;
  showLayout = true;

  constructor(private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url = e.urlAfterRedirects || e.url;
      this.showLayout = !url.startsWith('/login');
    });
  }

  private authService = inject(AuthService);

  menu = [
    { label: 'Departamento', icon: 'pi pi-building', items: [
        {
          label: 'Administración General',
          icon: 'pi pi-plus',
        },
        {
          label: 'Administración Financiera',
          icon: 'pi pi-search',
        },
        {
          label: 'Almacén',
          icon: 'pi pi-search',
        },
        {
          label: 'Auditoría',
          icon: 'pi pi-search',
        }
      ] },
    { label: 'Empleado', icon: 'pi pi-box', routerLink: '/' },
    { label: 'Clientes', icon: 'pi pi-users', routerLink: '/' },
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: () => {
        this.authService['clearTokens']();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    });
  }
}
