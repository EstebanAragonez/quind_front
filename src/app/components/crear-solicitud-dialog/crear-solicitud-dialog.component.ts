import { Component } from '@angular/core';
import { CrearSolicitudService } from '../../service/crear-solicitud.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-solicitud-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: '../crear-solicitud-dialog/crear-solicitud-dialog.component.html',
  styleUrls: ['../crear-solicitud-dialog/crear-solicitud-dialog.component.css']
})
export class CrearSolicitudDialogComponent {
  solicitudForm!: FormGroup;
  tiposSolicitud: any[] = [];
  crearSolicitudForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CrearSolicitudDialogComponent>,
    private crearSolicitudService: CrearSolicitudService
  ) { }

  ngOnInit(): void {
    this.solicitudForm = this.fb.group({
      tipoSolicitud: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      fechaSolicitud: ['', Validators.required],
      comentarios: ['']
    });

    this.cargarTiposSolicitud();
  }

  cargarTiposSolicitud(): void {
    this.crearSolicitudService.getTiposSolicitud().subscribe(
      (data: any[]) => {
        this.tiposSolicitud = data.map(tipo => ({
          nombreAMostrar: this.getTipoSolicitudNombre(tipo.nombre),
          nombreOriginal: tipo.nombre
        }));
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  registrarSolicitud(): void {
    if (this.solicitudForm.invalid) {
      Swal.fire({
        title: 'Datos incompletos',
        text: 'Por favor verifique, datos obligatorios incompletos.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    const solicitud = this.solicitudForm.value;
    const fechaSolicitud = new Date(solicitud.fechaSolicitud);
    const fechaActual = new Date();
    
    if (solicitud.tipoSolicitud === 'VC' || solicitud.tipoSolicitud === 'DNR') {
      const diferenciaMeses = (fechaSolicitud.getMonth() - fechaActual.getMonth()) + (12 * (fechaSolicitud.getFullYear() - fechaActual.getFullYear()));
      if (diferenciaMeses < 1) {
        Swal.fire({
          title: 'Anticipación insuficiente',
          text: this.errorMessage,
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
    } else if (solicitud.tipoSolicitud === 'AU') {
      const diferenciaDias = Math.ceil((fechaSolicitud.getTime() - fechaActual.getTime()) / (1000 * 3600 * 24));
      if (diferenciaDias < 2) {
        Swal.fire({
          title: 'Anticipación insuficiente',
          text: this.errorMessage,
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
        return;
      }
    }

    const payload = {
      tipoSolicitud: solicitud.tipoSolicitud,
      numeroDocumento: solicitud.numeroDocumento,
      fechaSolicitud: solicitud.fechaSolicitud,
      comentarios: solicitud.comentarios || ''
    };

    this.crearSolicitudService.crearSolicitud(payload).subscribe(
      response => {
        Swal.fire({
          title: 'Solicitud creada',
          text: 'La solicitud se ha creado exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }

  getTipoSolicitudNombre(codigo: string): string {
    switch (codigo) {
      case 'VC': return 'VACACIONES';
      case 'DNR': return 'DÍAS NO REMUNERADOS';
      case 'AU': return 'AUSENTISMO';
      case 'OS': return 'OTRAS SOLICITUDES';
      case 'IM': return 'INCAPACIDAD MEDICA';
      default: return '';
    }
  }
}
