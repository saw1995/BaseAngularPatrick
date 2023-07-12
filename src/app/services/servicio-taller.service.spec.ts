import { TestBed } from '@angular/core/testing';

import { ServicioTallerService } from './servicio-taller.service';

describe('ServicioTallerService', () => {
  let service: ServicioTallerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioTallerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
