import { Component, inject } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { PanelToken } from '../../theme/tokens';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-view',
  imports: [
    PanelModule,
    FormsModule,
    InputTextModule,
    IftaLabelModule,
    ButtonModule,
    ImageModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login-view.html',
})
export class LoginView {
  panelToken = PanelToken;

  username: string = "";
  password: string = "";

  constructor(private router: Router, private messageService: MessageService) { }

  private auth = inject(AuthService);

  login() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        console.log('Login success');
        this.router.navigate(['/clientes']);
      },
      error: err => {
        console.log(err);
        
        this.messageService.add({
          severity: 'error',
          summary: err.error.error,
          detail: err.error.message === "INVALID_CREDENTIALS" ? 
            'Usuario o contraseña inválidos' :
            'Error al iniciar sesión'
        });
      }
    });
  }
}
