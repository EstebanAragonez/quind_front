import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { CrearSolicitudDialogComponent } from '../crear-solicitud-dialog/crear-solicitud-dialog.component';
import { CrearSolicitudService } from '../../service/crear-solicitud.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, CrearSolicitudDialogComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    public dialog: MatDialog,
    private crearSolicitudService: CrearSolicitudService
  ) {}

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
