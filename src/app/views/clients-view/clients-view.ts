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

  ngOnInit(): void {
    this.store.load();
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

  onDelete(client: Client) {
    this.store.delete(client.clientId);
  }

  onUpdate(client: Client) {
    this.store.update(client);
  }
}
