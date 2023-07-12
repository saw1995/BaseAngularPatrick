import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  url : any;
  
  constructor(private http: HttpClient, public router: Router) { }

  ngOnInit(): void {
    this.url = globals.url;
    if(localStorage.getItem("id_usuario") != undefined){
      this.salirLogin(localStorage.getItem("id_login"))
    }else{
      this.router.navigate(['/']);
    }
    
  }

  salirLogin(id_login:any){
    Swal.fire({title: 'Cerrando Sesion en otro Dispositivo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "latitud_salida": "0",
      "longitud_salida": "0",
      "observacion_salida": "Cierre por el usuario",
      "dispositivo_salida": "Web",
      "estado": "0",
      "id": id_login,
      "id_empresa": localStorage.getItem("id_empresa"),
    };
    this.http.post(this.url+"usuario/salirLogin", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == "1"){
                
            localStorage.clear();
            this.router.navigate(['/']);

          }else{
            localStorage.clear();
             Swal.fire("Existe un problema al cerrar el otro dispositivo, porfavor contactese con el administrador del sistema", datosNodejs, "warning");
          }
        }else{
          localStorage.clear();
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        localStorage.clear();
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
