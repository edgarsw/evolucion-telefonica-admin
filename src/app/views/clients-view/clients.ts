import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AgregarClienteFormComponent } from '../../components/add-client-form/add-client-form.component';
import { ClientsTableComponent } from '../../components/clients-table/clients-table.component';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { clientes } from '../../utils/hardcode-data.utils';

@Component({
  selector: 'app-clients',
  imports: [FloatLabelModule,
    InputTextModule,
    CardModule,
    CheckboxModule,
    TextareaModule,
    ButtonModule,
    AgregarClienteFormComponent,
    ClientsTableComponent,
    Toast,
    ButtonModule,
  ],
  providers: [
    MessageService
  ],
  templateUrl: './clients.html'
})
export class ClientesComponent {
  showAddForm = false;
  clientes = clientes;

  constructor(private messageService: MessageService) { }


  onRegister(cliente: any) {
    console.log("cliente", cliente);

    this.clientes = [...this.clientes, cliente];
    this.showAddForm = false;
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Cliente creado exitosamente' });
  }

  onAddRequested() {
    this.showAddForm = true;
  }

  onCancelAdd() {
    this.showAddForm = false;
  }
}
