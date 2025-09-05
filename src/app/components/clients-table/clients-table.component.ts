import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SelectModule } from 'primeng/select';
import { NgClass } from '@angular/common';
import { ciudades, estados, tipoClientes, zonas } from '../../utils/hardcode-data.utils';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { Client } from '../../models/client.model';
import { RadioButton } from 'primeng/radiobutton';
import { LimitTypeEnum } from '../../enums/limit-type.enum';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-clients-table',
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
    ConfirmDialog,
    SelectModule,
    InputNumberModule,
    TextareaModule,
    RadioButton,
    DatePickerModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './clients-table.component.html',
})
export class ClientsTableComponent {
  @Input() clientes: Client[] = [];
  @Output() addRequested = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<Client>();
  @Output() updateRequested = new EventEmitter<Client>();

  zonas = zonas;
  tipoClientes = tipoClientes;
  ciudades = ciudades;
  estados = estados;
  searchValue: string | undefined;
  limitType!: string;
  LimitTypeEnum = LimitTypeEnum;
  temporalDate: Date | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;

  editVisible = false;
  saldoVisible = false;
  saldoCliente: Client | null = null;
  saldoValue: number | null = null;
  porcentajeValue: number | null = null;
  private editingRef: Client | null = null;
  editCliente: Client = this.emptyCliente();

  globalFilterFields: (keyof Client)[] = [
    'isActiveClient', 'name', 'taxId', 'street', 'exteriorNumber', 'interiorNumber',
    'neighborhood', 'state', 'city', 'municipality', 'postalCode', 'phone', 'email'
  ];

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit() {
    this.minDate = new Date();
  }

  private emptyCliente(): Client {
    return {
      clientId: 0,
      name: '',
      taxId: '',
      street: '',
      exteriorNumber: '',
      interiorNumber: '',
      neighborhood: '',
      state: '',
      city: '',
      municipality: '',
      postalCode: 0,
      phone: '',
      email: '',
      consignmentPriceICC: '',
      latitude: '',
      longitude: '',
      zoneId: '',
      businessType: '',
      reference: '',
      hasPhoto: 0,
      isCommercial: 0,
      isActiveClient: 1,
      subBranchTypeId: '',
    };
  }


  onAddClick() {
    this.addRequested.emit();
  }

  clear(table: any, input?: HTMLInputElement) {
    table.clear();
    if (input) input.value = '';
  }

  editClient(rowData: Client) {
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
      this.updateRequested.emit(this.editCliente);
    }
    this.editVisible = false;
    this.editingRef = null;
  }

  deleteClient(event: Event, rowData: Client) {
    this.confirmationService.confirm({
      target: event.currentTarget as HTMLElement,
      message: '¿Eliminar este cliente?',
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Eliminar', severity: 'danger' },
      accept: () => {
        this.deleteRequested.emit(rowData);   // ✅ bubble up to parent
      }
    });
  }

  addSaldo(rowData: Client) {
    this.saldoCliente = rowData;
    this.saldoValue = null;
    this.porcentajeValue = null;
    this.saldoVisible = true;
  }

  cancelSaldo() {
    this.saldoVisible = false;
    this.saldoCliente = null;
    this.saldoValue = null;
    this.porcentajeValue = null;
  }

  confirmSaldo(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    if (this.saldoCliente) {
      console.log('Cliente:', this.saldoCliente.name);
      console.log('Saldo:', this.saldoValue);
      console.log('Porcentaje:', this.porcentajeValue);
      this.messageService.add({ severity: 'success', summary: 'Actualizado', detail: 'Saldo anadido' });
    }
    this.saldoVisible = false;
  }
}