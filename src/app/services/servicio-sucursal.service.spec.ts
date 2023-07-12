import { TestBed } from '@angular/core/testing';

import { ServicioSucursalService } from './servicio-sucursal.service';

describe('ServicioSucursalService', () => {
  let service: ServicioSucursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioSucursalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
