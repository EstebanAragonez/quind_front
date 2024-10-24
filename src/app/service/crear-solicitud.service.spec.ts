import { TestBed } from '@angular/core/testing';

import { CrearSolicitudService } from './crear-solicitud.service';

describe('CrearSolicitudService', () => {
  let service: CrearSolicitudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrearSolicitudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
