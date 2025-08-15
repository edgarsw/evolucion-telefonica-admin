import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AgregarClienteForm } from '../components/agregar-cliente-form/agregar-cliente-form';
import { TablaClientes } from '../components/tabla-clientes/tabla-clientes';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { clientes } from '../utils/hardcode-data.utils';

@Component({
  selector: 'app-clientes',
  imports: [FloatLabelModule,
    InputTextModule,
    CardModule,
    CheckboxModule,
    TextareaModule,
    ButtonModule,
    AgregarClienteForm,
    TablaClientes,
    Toast, 
    ButtonModule, 
  ],
  providers: [
    MessageService
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent {
  showAddForm = false;
  clientes = clientes;

  constructor(private messageService: MessageService) {}


  onRegister(cliente: any) {
    console.log("cliente",cliente);
    
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
