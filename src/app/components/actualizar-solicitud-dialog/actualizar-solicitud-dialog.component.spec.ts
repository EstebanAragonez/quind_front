import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarSolicitudDialogComponent } from './actualizar-solicitud-dialog.component';

describe('ActualizarSolicitudDialogComponent', () => {
  let component: ActualizarSolicitudDialogComponent;
  let fixture: ComponentFixture<ActualizarSolicitudDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarSolicitudDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarSolicitudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
