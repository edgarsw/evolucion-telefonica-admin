import { Component, EventEmitter, Output } from '@angular/core';
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
import { ciudades, estados, newCliente, tipoClientes, zonas } from '../../utils/hardcode-data.utils';

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
  @Output() register = new EventEmitter<any>();
  zonas = zonas;
  tipoClientes = tipoClientes;
  ciudades = ciudades;
  estados = estados;
  newCliente = newCliente;

  onRegisterClick(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.register.emit({ ...this.newCliente });

    form.resetForm();
    this.newCliente = {
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
      correo: '',
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
}
