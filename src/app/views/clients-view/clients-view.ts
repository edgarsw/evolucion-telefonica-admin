import { Component, inject } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AgregarClienteFormComponent } from '../../components/add-client-form/add-client-form.component';
import { ClientsTableComponent } from '../../components/clients-table/clients-table.component';
import { Client } from '../../models/client.model';
import { ClientStore } from '../../stores/client.store';
import { SubBranchTypeService } from '../../services/sub-branch-type.service';

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
    ButtonModule,
  ],
  templateUrl: './clients-view.html'
})
export class ClientesComponent {
  showAddForm = false;

  private store = inject(ClientStore);
  private subBranchTypeService = inject(SubBranchTypeService);
  tipoClientes: string[] = [];

  ngOnInit(): void {
    this.store.load();
    this.subBranchTypeService.getAll().subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          this.tipoClientes = res.data;
        }
      },
      error: (err) => {
        console.error('Error fetching sub-branch types:', err);
      },
    });
  }

  get clientes() {
    return this.store.clients();
  }

  onRegister(client: Client) {
    this.store.add(client);
    this.showAddForm = false;
  }

  onAddRequested() {
    this.showAddForm = true;
  }

  onCancelAdd() {
    this.showAddForm = false;
  }

  onDeactivate(client: Client) {
    this.store.deactivate(client.clientId);
  }

  onUpdate(client: Client) {
    this.store.update(client);
  }
}
