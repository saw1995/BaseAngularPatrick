import { TestBed } from '@angular/core/testing';

import { ServicioParqueoService } from './servicio-parqueo.service';

describe('ServicioParqueoService', () => {
  let service: ServicioParqueoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioParqueoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
