import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioParqueoService {

  public id_parqueo:any = "";

  constructor() { }

  setIdParqueo(id_parqueo: any) {
    this.id_parqueo = id_parqueo;
  }

  getIdParqueo() {
    return this.id_parqueo;
  }
}
