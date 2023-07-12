import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../../utils/global';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificacion-lista',
  templateUrl: './notificacion-lista.component.html',
  styleUrls: ['./notificacion-lista.component.css']
})
export class NotificacionListaComponent implements OnInit {
  url : any;

  listaNotificacion:any = [];

  constructor(private http: HttpClient, public router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("Notificacion") != undefined){
      this.url = globals.url;  
      this.listaNotificacionByUsuarioRecepcionEstado();
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  listaNotificacionByUsuarioRecepcionEstado(){
    let parametros = {
      "id_usuario_receptor": localStorage.getItem("id_usuario"),
      "estado": "1"
    };
    this.http.post(this.url+"notificacion/listaNotificacionByUsuarioRecepcionEstado", parametros).subscribe((datos_recibidos:any) => {
      console.log(datos_recibidos)
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

}
