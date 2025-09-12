import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
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
import { ciudades, estados, zonas } from '../../utils/hardcode-data.utils';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { Client } from '../../models/client.model';
import { LimitTypeEnum } from '../../enums/limit-type.enum';
import { DatePickerModule } from 'primeng/datepicker';
import { SubClientService } from '../../services/sub-client.service';
import { ClientStore } from '../../stores/client.store';
import { BalanceTransactionService } from '../../services/balance-transaction.service';
import { TransactionType } from '../../models/balance-transaction.model';
import { AuthService } from '../../services/auth.service';
import { TooltipModule } from 'primeng/tooltip';

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
    DatePickerModule,
    TooltipModule
  ],
  providers: [ConfirmationService],
  templateUrl: './clients-table.component.html',
})
export class ClientsTableComponent {
  @Input() clientes: Client[] = [];
  @Input() tipoClientes: string[] = [];
  @Output() addRequested = new EventEmitter<void>();
  @Output() deleteRequested = new EventEmitter<Client>();
  @Output() updateRequested = new EventEmitter<Client>();

  zonas = zonas;
  ciudades = ciudades;
  estados = estados;
  searchValue: string | undefined;
  isTemporalLimit: boolean = false;
  LimitTypeEnum = LimitTypeEnum;
  temporalDate: Date | null | undefined;
  minDate: Date | undefined;
  maxDate: Date | undefined;
  expandedRows = {};
  editVisible = false;
  saldoDialogVisible = false;
  configurationVisible = false;

  selectedClient: Client | null = null;
  balanceValue: number | null = null;
  porcentajeValue: number | null = null;
  permanentLimitValue: number | null = null;
  temporalLimitValue: number | null = null;
  private editingRef: Client | null = null;
  editCliente: Client = this.emptyCliente();

  globalFilterFields: (keyof Client)[] = [
    'isActiveClient', 'name', 'taxId', 'street', 'exteriorNumber', 'interiorNumber',
    'neighborhood', 'state', 'city', 'municipality', 'postalCode', 'phone', 'email'
  ];

  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private subClientService = inject(SubClientService);
  private store = inject(ClientStore);
  private balanceTransactionService = inject(BalanceTransactionService);
  private authService = inject(AuthService);

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
        this.deleteRequested.emit(rowData);
      }
    });
  }

  openAddSaldo(client: Client) {
    this.selectedClient = client;
    this.saldoDialogVisible = true;
  }


  cancelSaldo() {
    this.saldoDialogVisible = false;
    this.selectedClient = null;
    this.balanceValue = null;
    this.porcentajeValue = null;
  }

  
  openActivationSettings(client: Client) {
    console.log("client",client);
    
    this.selectedClient = client;
    this.permanentLimitValue = client.permanentLimit ?? null;
    this.temporalLimitValue = client.temporalLimit ?? null;
    if (this.temporalLimitValue) {
      this.isTemporalLimit = true;
    }
    this.temporalDate = client.temporalLimitDate
      ? new Date(client.temporalLimitDate)
      : null;
    this.configurationVisible = true;
    this.porcentajeValue = client.percentage ?? null;
  }
  
  cancelConfiguration() {
    this.configurationVisible = false;
    this.isTemporalLimit = false;
    this.porcentajeValue = null;
    this.selectedClient = null;
  }

  confirmConfiguration(event: Event, form: NgForm) {
     if (!this.selectedClient) return;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const message = `
      Se van a actualizar los parámetros de configuración de este cliente.<br>
      <strong>Porcentaje extra:</strong> ${this.porcentajeValue ?? 0}%<br>
      <strong>Límite permanente:</strong> ${!this.isTemporalLimit ? this.permanentLimitValue : '-'}<br>
      <strong>Límite temporal:</strong> ${this.isTemporalLimit ? this.temporalLimitValue : '-'}<br>
      <strong>Fecha límite:</strong> ${this.isTemporalLimit && this.temporalDate ? this.temporalDate.toLocaleDateString() : '-'}
    `;

    this.confirmationService.confirm({
      target: event.currentTarget as HTMLElement,
      message,
      header: 'Confirmar Configuración',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Confirmar', severity: 'success' },
      accept: () => {
        const payload: any = {
          ...this.selectedClient,
          percentage: this.porcentajeValue,
          permanentLimit: !this.isTemporalLimit ? this.permanentLimitValue : null,
          temporalLimit: this.isTemporalLimit ? this.temporalLimitValue : null,
          temporalLimitDate: this.isTemporalLimit && this.temporalDate
            ? new Date(this.temporalDate).toISOString().split('T')[0]
            : null,
        };

        this.store.update(payload);

        this.configurationVisible = false;
        this.selectedClient = null;
        this.porcentajeValue = null;
        this.permanentLimitValue = null;
        this.temporalLimitValue = null;
        this.temporalDate = null;
        this.isTemporalLimit = false;
      },
      reject: () => {
        this.configurationVisible = true;
      }
    });
  }

  confirmSaldo(event: Event, form: NgForm) {
    if (!this.selectedClient) return;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const percentage = this.selectedClient.percentage ?? null;

    const hasExtra = percentage && percentage > 0;
    let newBalance = this.balanceValue ?? 0;
    if (hasExtra) {
      newBalance = newBalance + (newBalance * percentage) / 100;
    }
    const message = hasExtra
      ? `Se va a ingresar la cantidad de $${newBalance}, debido a que este usuario cuenta con ${percentage}% adicional. 
        ¿Desea confirmar la transacción?`
      : `Se va a ingresar la cantidad de $${newBalance}. ¿Desea confirmar la transacción?`;

    this.confirmationService.confirm({
      target: event.currentTarget as HTMLElement,
      message,
      header: 'Confirmar',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: { label: 'Cancelar', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Confirmar', severity: 'success' },

      accept: () => {
        this.addBalanceToClient(newBalance);
        this.registerTransaction(newBalance);

        this.saldoDialogVisible = false;
        this.selectedClient = null;
        this.balanceValue = null;
        this.porcentajeValue = null;
      },
      reject: () => {
        this.saldoDialogVisible = true;
      }
    });
  }

  private addBalanceToClient(newBalance: number) {
    const currentClientBalance = this.selectedClient?.balance;
    const totalBalance =
      currentClientBalance
        ? Number(currentClientBalance) + Number(newBalance)
        : Number(newBalance);
    console.log("totalBalance", totalBalance);

    let payload: any = {
      ...this.selectedClient,
      balance: totalBalance,
    };

    this.store.update(payload);
  }

  private registerTransaction(amount: number) {
    const employeeId = this.authService.getEmployeeId();

    this.balanceTransactionService.create({
      transactionType: TransactionType.INGRESO,
      amount: amount,
      clientId: this.selectedClient!.clientId,
      employeeId: employeeId,
    }).subscribe({
      next: (res) => {
        console.log('Transaction saved:', res);
      },
      error: (err) => {
        console.error('Error saving transaction', err);
      }
    });
  }


  onRowExpand(event: TableRowExpandEvent) {
    console.log("onRowExpand", event.data);
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    console.log("onRowCollapse", event.data);
  }

  onToggleSubClientActive(subclient: any, checked: boolean) {
    subclient.isActive = checked ? 1 : 0;
    this.subClientService.update(subclient.id, { isActive: subclient.isActive }).subscribe({
      next: () => {
        const status = subclient.isActive ? 'activado' : 'desactivado';
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: `Subcliente '${subclient.name}' ha sido ${status}`
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el estado'
        });
        // rollback UI
        subclient.isActive = subclient.isActive ? 0 : 1;
      }
    });
  }
}