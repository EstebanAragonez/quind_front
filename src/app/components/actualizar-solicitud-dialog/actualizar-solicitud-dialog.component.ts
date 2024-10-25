import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-actualizar-solicitud-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: '../actualizar-solicitud-dialog/actualizar-solicitud-dialog.component.html',
  styleUrls: ['../actualizar-solicitud-dialog/actualizar-solicitud-dialog.component.css']
})
export class ActualizarSolicitudDialogComponent {
  solicitudForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ActualizarSolicitudDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.solicitudForm = this.fb.group({
      estado: [data.estado, Validators.required],
      comentarios: [data.comentarios || '']
    });

    this.solicitudForm = this.fb.group({
      estado: [data.estado, Validators.required],
      comentarios: [data.comentarios || '']
    });

    this.solicitudForm.get('estado')?.valueChanges.subscribe((estado) => {
      this.validarComentarios(estado);
    });

    this.validarComentarios(this.solicitudForm.get('estado')?.value);
  }

  validarComentarios(estado: string): void {
    const comentariosControl = this.solicitudForm.get('comentarios');

    if (estado === 'APROBADA' || estado === 'DENEGADA') {
      comentariosControl?.setValidators([Validators.required]);
    } else {
      comentariosControl?.clearValidators();
    }

    comentariosControl?.updateValueAndValidity();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  actualizar(): void {
    if (this.solicitudForm.valid) {
      this.dialogRef.close(this.solicitudForm.value);
    }
  }
}
