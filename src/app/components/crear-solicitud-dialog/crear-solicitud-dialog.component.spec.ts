import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSolicitudDialogComponent } from './crear-solicitud-dialog.component';

describe('CrearSolicitudDialogComponent', () => {
  let component: CrearSolicitudDialogComponent;
  let fixture: ComponentFixture<CrearSolicitudDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearSolicitudDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearSolicitudDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
