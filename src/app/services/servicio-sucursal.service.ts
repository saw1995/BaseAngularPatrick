import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioSucursalService {

  public id_sucursal:any = "";

  constructor() { }

  setIdSucursal(id_sucursal: any) {
    this.id_sucursal = id_sucursal;
  }

  getIdSucursal() {
    return this.id_sucursal;
  }
}
