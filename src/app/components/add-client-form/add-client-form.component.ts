import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';

import { NgClass } from '@angular/common';
import { ciudades, estados, newCliente, zonas } from '../../utils/hardcode-data.utils';

@Component({
  selector: 'app-add-client-form',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    TextareaModule,
    CheckboxModule,
    ButtonModule,
    SelectModule,
    InputNumberModule
  ],
  templateUrl: './add-client-form.component.html'
})
export class AgregarClienteFormComponent {
  @Input() tipoClientes: string[] = [];
  @Output() register = new EventEmitter<any>();
  zonas = zonas;
  ciudades = ciudades;
  estados = estados;
  newCliente = newCliente;

  addClient(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.register.emit({ ...this.newCliente });

    form.resetForm();
    this.newCliente = {
      isActiveClient: 1,
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
      subBranchTypeId: '',
    };

  }
}
