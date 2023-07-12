import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioTallerService {

  public id_taller:any = "";

  constructor() { }

  setIdTaller(_idTaller: any) {
    this.id_taller = _idTaller;
  }

  getIdTaller() {
    return this.id_taller;
  }
}
