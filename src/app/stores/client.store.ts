import { Injectable, signal, inject } from '@angular/core';
import { Client } from '../models/client.model';
import { StatusResponse } from '../enums/status-response.enum';
import { MessageService } from 'primeng/api';
import { ClientService } from '../services/client.service';

@Injectable({ providedIn: 'root' })
export class ClientStore {
    private clientService = inject(ClientService);
    private messageService = inject(MessageService);

    clients = signal<Client[]>([]);
    loading = signal<boolean>(false);

    load() {
        this.loading.set(true);
        this.clientService.getClients().subscribe({
            next: (res) => {
                if (res.status === StatusResponse.SUCCESS && res.data) {
                    this.clients.set(res.data);
                }
                this.loading.set(false);
            },
            error: (err) => {
                this.loading.set(false);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los clientes',
                });
                console.error('Error fetching clients:', err);
            },
        });
    }

    add(client: Client) {
        this.clientService.addClient(client).subscribe({
            next: (res) => {
                if (res.status === StatusResponse.SUCCESS && res.data) {
                    this.clients.update((list) => [...list, res.data]);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Cliente agregado',
                        detail: `El cliente ${res.data.name} fue agregado correctamente`,
                    });
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo registrar el cliente',
                });
                console.error('Error adding client:', err);
            },
        });
    }


    update(client: Client) {
        this.clientService.updateClient(client).subscribe({
            next: (res) => {
                if (res.status === StatusResponse.SUCCESS && res.data) {
                    this.clients.update((list) =>
                        list.map((c) => (c.clientId === client.clientId ? res.data! : c))
                    );
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Cliente actualizado',
                        detail: `El cliente ${res.data.name} fue actualizado correctamente`,
                    });
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el cliente',
                });
                console.error('Error updating client:', err);
            },
        });
    }


    delete(clientId: number) {
        this.clientService.deleteClient(clientId).subscribe({
            next: (res) => {
                if (res.status === StatusResponse.SUCCESS) {
                    this.clients.update((list) => list.filter((c) => c.clientId !== clientId));
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Eliminado',
                        detail: `Cliente eliminado correctamente`,
                    });
                }
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo eliminar el cliente',
                });
                console.error('Error deleting client:', err);
            },
        });
    }
}
