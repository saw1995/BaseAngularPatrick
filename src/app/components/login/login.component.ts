import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  url : any;

  usuario:string = '';
  pass:string = '';

  constructor(private http: HttpClient, public router: Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("id_usuario") != undefined){
      this.router.navigate(['/']);
    }else{
      this.url = globals.url;
    }
  }

  usuarioByCiPass(){
    if(this.usuario != ""){
      if(this.pass != ""){
        Swal.fire({title: 'Autentificando Usuario',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

        let parametros = {
          "ci": this.usuario,
          "pass": this.pass
        };
        this.http.post(this.url+"usuario/usuarioByCiPass", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              if(datos.length > 0){
 
                if(datos[0]["estado_usuario"] == "1"){
                  localStorage.setItem('id_usuario', datos[0]["id"]);
                    localStorage.setItem('id_rol', datos[0]["id_rol"]);
                    localStorage.setItem('foto_usuario', datos[0]["foto_usuario"]);
                    localStorage.setItem('logo_empresa', datos[0]["logo_empresa"]);
                    localStorage.setItem('nombre_empresa', datos[0]["nombre_empresa"]);
                    localStorage.setItem('nombre_usuario', datos[0]["nombre"]);
                    localStorage.setItem('appat_usuario', datos[0]["appat"]);
                    localStorage.setItem('apmat_usuario', datos[0]["apmat"]);
                    localStorage.setItem('nombre_rol', datos[0]["nombre_rol"]); 

                    this.loginByUsuarioPlataforma();
                }else{
                  Swal.fire("Usuario Bloqueado", "Contactese con el administrador de la Importadora.", "warning");
                }
              }else{
                Swal.fire("Usuario no Identificado", "El usuario y/o contraseña no son correctas.", "warning");
              }
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }else{
        Swal.fire("Campo de Texto vacio", "Ingrese su Contraseña e intente nuevamente.", "warning");
      }
    }else{
      Swal.fire("Campo de Texto vacio", "Ingrese su Usuario e intente nuevamente.", "warning");
    }
  }
  
  loginByUsuarioPlataforma(){
    Swal.fire({title: 'Buscando cuenta abierta',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "id_usuario": localStorage.getItem("id_usuario"),
      "plataforma": "Web"
    };
    this.http.post(this.url+"usuario/loginByUsuarioPlataforma", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.length > 0){

            if(datos[0]["estado"] == "1"){
              localStorage.setItem('id_login', datos[0]["id"]);
              Swal.fire({   
                  title: "¿Cerrar Sesión en el otro Dispositivo?",   
                  text: "Hemos detectado una cuenta abierta en otro dispositivo, para continuar cierre la otra sesion.",   
                  icon: 'warning',
                  showCancelButton: true,   
                  confirmButtonColor: "#DD6B55",   
                  confirmButtonText: "Cerrar Sesión",   
                  cancelButtonText: "No Ingresar"
              }).then((result) => {
                  if (result.isConfirmed) {
                    this.salirLogin(datos[0]["id"]);
                  }else{
                      localStorage.clear();
                  }
              })
            }else{
              this.agregarLogin();
            }

          }else{
            this.agregarLogin();
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

  agregarLogin(){
    Swal.fire({title: 'Autentificando usuario',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "id_usuario": localStorage.getItem("id_usuario"),
      "plataforma": "Web",
      "latitud_ingreso": "0",
      "longitud_ingreso": "0",
      "dispositivo_ingreso": "Web",
      "estado": "1"
    };
    this.http.post(this.url+"usuario/agregarLogin", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == "1"){
            localStorage.setItem('id_login', datos.id_login);
            this.listaModuloRolByRol();
          }else{
            localStorage.clear();
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

  salirLogin(id_login:string){
    Swal.fire({title: 'Cerrando Sesion en otro Dispositivo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "latitud_salida": "0",
      "longitud_salida": "0",
      "observacion_salida": "Sesion cerrada por cambio de dispositivo web",
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
                
            this.agregarLogin();

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

  listaModuloRolByRol(){
    Swal.fire({title: 'Buscando modulos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "id_rol": localStorage.getItem("id_rol"),
      "id_empresa": localStorage.getItem("id_empresa"),
    };
    this.http.post(this.url+"rol/listaModuloRolByRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          var i:number; 
          for(i=0;i<datos.length;i++){
            localStorage.setItem(datos[i]["nombre"], "1"); 
          }
          
          this.router.navigate(['/']);
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
