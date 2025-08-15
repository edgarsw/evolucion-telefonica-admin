import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { NgClass } from '@angular/common';
import { ciudades, estados, tipoClientes, zonas } from '../../utils/hardcode-data.utils';
import { InputNumberModule } from 'primeng/inputnumber';



@Component({
  selector: 'app-tabla-clientes',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    TableModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DialogModule,
    FloatLabelModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialog,
    SelectModule,
    InputNumberModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './tabla-clientes.html',
})
export class TablaClientes {
  @Input() clientes: Cliente[] = [];
  @Output() addRequested = new EventEmitter<void>();
  zonas = zonas;
  tipoClientes = tipoClientes;
  ciudades = ciudades;
  estados = estados;
  searchValue: string | undefined;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  globalFilterFields: (keyof Cliente)[] = [
    'clienteactivo', 'nombre', 'rfc', 'calle', 'numexterior', 'numinterior', 'colonia',
    'estado', 'ciudad', 'municipio', 'cp', 'telefono', 'telefonofijo', 'correo', 'facebook'
  ];

  editVisible = false;
  private editingRef: Cliente | null = null;
  editCliente: Cliente = this.emptyCliente();

  private emptyCliente(): Cliente {
    return {
      clienteactivo: '',
      nombre: '',
      rfc: '',
      calle: '',
      numexterior: '',
      numinterior: '',
      colonia: '',
      estado: '',
      ciudad: '',
      municipio: '',
      cp: '',
      telefono: '',
      telefonofijo: '',
      correo: '',
      facebook: '',
      precioconsigna: '',
      latitud: '',
      longitud: '',
      idzona: '',
      giro: '',
      clasificacion: '',
      referencia: '',
      isfoto: undefined,
      iscomercial: undefined
    };
  }


  onAddClick() {
    this.addRequested.emit();
  }

  clear(table: any, input?: HTMLInputElement) {
    table.clear();
    if (input) input.value = '';
  }

  editClient(rowData: Cliente) {
    this.editingRef = rowData;

    this.editCliente = { ...rowData };
    this.editVisible = true;
  }

  cancelEdit() {
    this.editVisible = false;
    this.editingRef = null;
  }

  saveEdit(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    if (this.editingRef) {
      Object.assign(this.editingRef, this.editCliente);
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Cliente actualizado' });
    }
    this.editVisible = false;
    this.editingRef = null;
  }

  deleteProduct(event: Event, rowData: Cliente) {
    this.confirmationService.confirm({
      target: event.currentTarget as HTMLElement,
      message: '¿Eliminar este cliente?',
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Eliminar', severity: 'danger' },
      accept: () => {
        this.clientes = this.clientes.filter(c => c !== rowData);
        this.messageService.add({ severity: 'info', summary: 'Eliminado', detail: 'Cliente eliminado' });
      }
    });
  }
}