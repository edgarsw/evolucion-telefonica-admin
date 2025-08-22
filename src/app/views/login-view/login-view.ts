import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { PanelToken } from '../../theme/tokens';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login-view',
  imports: [
    PanelModule,
    FormsModule,
    InputTextModule,
    IftaLabelModule,
    ButtonModule,
  ],
  templateUrl: './login-view.html',
})
export class LoginView {
  panelToken = PanelToken;

  username: string | undefined;
  password: string | undefined;

}
