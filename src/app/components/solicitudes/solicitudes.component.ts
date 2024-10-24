import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SolicitudesService } from '../../service/solicitudes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { ActualizarSolicitudService } from '../../service/actualizar-solicitud.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActualizarSolicitudDialogComponent } from '../actualizar-solicitud-dialog/actualizar-solicitud-dialog.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CrearSolicitudDialogComponent } from '../crear-solicitud-dialog/crear-solicitud-dialog.component';
import { CrearSolicitudService } from '../../service/crear-solicitud.service'


@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    CrearSolicitudDialogComponent
  ],
  templateUrl: '../solicitudes/solicitudes.component.html',
  styleUrls: ['../solicitudes/solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  solicitudForm!: FormGroup;
  solicitudes: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['tipoSolicitud', 'nombreEmpleado', 'fechaSolicitud', 'estado', 'comentarios', 'actualizar'];
  tiposDocumento: any[] = [];
  
  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'NUEVA':
        return 'estado-nueva';    // Azul
      case 'EN_PROCESO':
        return 'estado-en-proceso'; // Amarillo
      case 'APROBADA':
        return 'estado-aprobada';   // Verde
      case 'DENEGADA':
        return 'estado-denegada';   // Rojo
      default:
        return '';
    }
  }

  errorMessage: string = '';


  constructor(
    private fb: FormBuilder, 
    private solicitudesService: SolicitudesService,
    private actualizarSolicitudService: ActualizarSolicitudService,
    private crearSolicitudService: CrearSolicitudService,
    public dialog: MatDialog
  ) {}


  ngOnInit(): void {
    this.solicitudForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.cargarTiposDocumento();
  }
  
  cargarTiposDocumento(): void {
    this.solicitudesService.getTiposDocumento().subscribe(
      (data: any[]) => {
        console.log('Respuesta del backend:', data);  // Verifica la estructura de la respuesta
  
        // Mapea correctamente los tipos de documentos
        this.tiposDocumento = data.map(tipo => ({
          nombre: this.getDocumentoNombre(tipo.nombre),  // Mostrar nombre legible
          codigo: tipo.nombre  // Usar el código real para enviar en la búsqueda
        }));
  
        console.log(this.tiposDocumento);  // Verifica el resultado final
      },
      error => {
        this.errorMessage = 'Error al cargar los tipos de documento';
      }
    );
  }
  
  getDocumentoNombre(codigo: string): string {
    switch (codigo) {
      case 'CC': return 'Cédula de Ciudadanía';
      case 'CE': return 'Cédula de Extranjería';
      case 'PS': return 'Pasaporte';
      default: return 'Desconocido';
    }
  }

  buscarSolicitudes(): void {
    if (this.solicitudForm.invalid) {
      this.errorMessage = 'Por favor complete los campos requeridos';
      return;
    }

    this.errorMessage = '';
    const { tipoDocumento, numeroDocumento } = this.solicitudForm.value;
    console.log('Tipo de Documento Seleccionado:', tipoDocumento);

    this.solicitudesService.obtenerSolicitudes(tipoDocumento, numeroDocumento).subscribe(
      data => {
        this.solicitudes.data = data;
      },
      error => {
        this.errorMessage = 'Error al buscar las solicitudes. Inténtelo de nuevo.';
      }
    );
  }

  openActualizarDialog(solicitud: any): void {
    const dialogRef = this.dialog.open(ActualizarSolicitudDialogComponent, {
      width: '600px',  
      minHeight: '400px',
      data: {
        estado: solicitud.estado,
        comentarios: solicitud.comentarios
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.actualizarSolicitudService.actualizarSolicitud(solicitud.id, result.estado, result.comentarios)
          .subscribe(() => {
            solicitud.estado = result.estado;
            solicitud.comentarios = result.comentarios;
            alert('Solicitud actualizada exitosamente');
          }, error => {
            console.error('Error al actualizar la solicitud:', error);
            alert('Error al actualizar la solicitud');
          });
      }
    });
  }

  getTipoSolicitudNombre(codigo: string): string {
    switch (codigo) {
      case 'VC': return 'VACACIONES';
      case 'DNR': return 'DÍAS NO REMUNERADOS';
      case 'AU': return 'AUSENTISMO';
      case 'OS': return 'OTRAS SOLICITUDES';
      case 'IM': return 'INCAPACIDAD MEDICA';
      default: return 'DESCONOCIDO';
    }
  }

  openCrearSolicitudDialog(): void {
    const dialogRef = this.dialog.open(CrearSolicitudDialogComponent, {
      width: '600px',
      minHeight: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Llama al servicio para crear la solicitud con los datos del modal
        this.crearSolicitudService.crearSolicitud(result).subscribe(
          response => {
            alert('Solicitud creada exitosamente');
            // Recargar las solicitudes si es necesario
          },
          error => {
            console.error('Error al crear la solicitud:', error);
            alert('Error al crear la solicitud');
          }
        );
      }
    });
  }

}
