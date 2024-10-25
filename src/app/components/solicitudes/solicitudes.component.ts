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
import { CrearSolicitudService } from '../../service/crear-solicitud.service';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import Swal from 'sweetalert2';





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
    CrearSolicitudDialogComponent,
    MatPaginator

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
        return 'estado-nueva';
      case 'EN_PROCESO':
        return 'estado-en-proceso';
      case 'APROBADA':
        return 'estado-aprobada';
      case 'DENEGADA':
        return 'estado-denegada';
      default:
        return '';
    }
  }

  errorMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder, 
    private solicitudesService: SolicitudesService,
    private actualizarSolicitudService: ActualizarSolicitudService,
    private crearSolicitudService: CrearSolicitudService,
    public dialog: MatDialog,
  ) {}


  ngOnInit(): void {
    this.solicitudForm = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.cargarTiposDocumento();
  }

  ngAfterViewInit() {
    this.solicitudes.paginator = this.paginator;
  }
  
  cargarTiposDocumento(): void {
    this.solicitudesService.getTiposDocumento().subscribe(
      (data: any[]) => {
        console.log('Respuesta del backend:', data);  

        this.tiposDocumento = data.map(tipo => ({
          nombre: this.getDocumentoNombre(tipo.nombre), 
          codigo: tipo.nombre  
        }));
  
        console.log(this.tiposDocumento); 
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
            Swal.fire({
              title: 'Solicitud actualizada exitosamente',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          }, error => {
            console.error('Error al actualizar la solicitud:', error);
            Swal.fire({
              title: 'Error al actualizar la solicitud',
              text: 'No se puede reactivar una solicitud Denegada,  por favor cree una nueva solicitud',
              icon: 'error',
              confirmButtonText: 'Cerrar',
              timer: 5000
            });
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
        this.crearSolicitudService.crearSolicitud(result).subscribe(
          response => {
            Swal.fire({
              title: 'Solicitud creada',
              text: 'La solicitud se ha creado exitosamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            });
          },
          error => {
            const errorMessage = (typeof error.error === 'string') ? error.error : 'Hubo un problema al crear la solicitud. Por favor, intenta nuevamente.';
        
            Swal.fire({
              title: 'Error',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        );
      }
    });
  }

}
