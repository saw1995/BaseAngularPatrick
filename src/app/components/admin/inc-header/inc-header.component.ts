import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../../utils/global';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import Swal from 'sweetalert2';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'inc-header',
  templateUrl: './inc-header.component.html',
  styleUrls: ['./inc-header.component.css']
})
export class IncHeaderComponent implements OnInit {
  url : any;
  id_usuario : any;
  usuario : any;
  foto : any;
  cargo : any;
  logo : any;

  listaNotificacion:any = [];

  constructor(private http: HttpClient, public router: Router) { }

  
  ngOnInit(): void {
    this.url = globals.url;
    this.id_usuario = encryptNumber(localStorage.getItem("id_usuario") || "");
    this.usuario = localStorage.getItem("nombre_usuario") + " " + localStorage.getItem("appat_usuario") + " " + localStorage.getItem("apmat_usuario");
    this.foto = localStorage.getItem("foto_usuario");
    this.cargo = localStorage.getItem("nombre_rol");
    this.logo = localStorage.getItem("logo_empresa");

    this.listaNotificacionByUsuarioRecepcionVistoEstado();

    let stop = false
    interval(300000)
    .pipe(takeWhile(() => !stop))
    .subscribe(() => {
      this.listaNotificacionByUsuarioRecepcionVistoEstado();
    });
  }

  click_notificacion(id_notificacion:any, ruta:any, id_uno:any, id_dos:any, id_tres:any){
    this.actualizarVistoById(id_notificacion, ruta, id_uno, id_dos, id_tres);
  }

  click_invitacion(id_usuario:any){

  }

  listaNotificacionByUsuarioRecepcionVistoEstado(){
    let parametros = {
      "id_usuario_receptor": localStorage.getItem("id_usuario"),
      "visto": "0",
      "estado": "1"
    };
    this.http.post(this.url+"notificacion/listaNotificacionByUsuarioRecepcionVistoEstado", parametros).subscribe((datos_recibidos:any) => {
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaNotificacion = datos;
        }else{

          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{

        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarVistoById(id_notificacion:any, ruta:any, id_uno:any, id_dos:any, id_tres:any){
    Swal.fire({title: 'Extrayendo informacion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "id_notificacion": id_notificacion,
      "visto": "1"
    };
    this.http.post(this.url+"notificacion/actualizarVistoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(id_uno !== ""){
            if(id_dos !== ""){
              if(id_tres !== ""){
                this.router.navigate([ruta, encryptNumber(id_uno), encryptNumber(id_dos), encryptNumber(id_tres)]);
              }else{
                this.router.navigate([ruta, encryptNumber(id_uno), encryptNumber(id_dos)]);
              }
            }else{
              this.router.navigate([ruta, encryptNumber(id_uno)]);
            }
          }

          this.listaNotificacionByUsuarioRecepcionVistoEstado();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{

        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
