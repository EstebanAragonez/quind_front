import { TestBed } from '@angular/core/testing';

import { ActualizarSolicitudService } from './actualizar-solicitud.service';

describe('ActualizarSolicitudService', () => {
  let service: ActualizarSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActualizarSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
