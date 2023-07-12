import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';

@Component({
  selector: 'inc-siderbar',
  templateUrl: './inc-siderbar.component.html',
  styleUrls: ['./inc-siderbar.component.css']
})
export class IncSiderbarComponent implements OnInit {
  url : any;
  usuario : any;
  foto : any;
  cargo : any;
  logo : any;

  menu_selec: any = "";

  panel_control:any = 0;
  usuarios:any = 0;
  sucursales:any = 0;
  parqueos:any = 0;
  clientes:any = 0;
  clientes_todos:any = 0;
  configuracion:any = 0;
  notificaciones:any = 0;
  talleres:any = 0;
  vehiculos:any = 0;
  blog:any = 0;
  importacion:any = 0;
  historias:any = 0;

  categorias:any = 0;
  categoria_clientes:any = 0;
  rutas:any = 0;

  id_sucursal:any = "";
  id_sucursal_enc:any = "";
  listaSucursal:any = [];

  constructor(private http: HttpClient, public router: Router, private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.url = globals.url;
    this.usuarioLoginByUsuarioEmpresa();

    this.usuario = localStorage.getItem("nombre_usuario") + " " + localStorage.getItem("appat_usuario") + " " + localStorage.getItem("apmat_usuario");
    this.foto = localStorage.getItem("foto_usuario");
    this.cargo = localStorage.getItem("nombre_rol");
  }

  usuarioLoginByUsuarioEmpresa(){
    if(localStorage.getItem("id_usuario") != undefined){
      Swal.fire({title: 'Autentificando Usuario',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      let parametros = {
        "id_usuario": localStorage.getItem("id_usuario")
      };
      this.http.post(this.url+"usuario/usuarioLoginByUsuarioEmpresa", parametros).subscribe((datos_recibidos:any) => {
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
                localStorage.setItem('nombre_usuario', datos[0]["nombre"]);
                localStorage.setItem('appat_usuario', datos[0]["appat"]);
                localStorage.setItem('apmat_usuario', datos[0]["apmat"]);
                localStorage.setItem('nombre_rol', datos[0]["nombre_rol"]);

                  this.loginByUsuarioPlataforma();
              }else{
                Swal.fire("Usuario Bloqueado", "Contactese con el administrador de la distribuidor que corresponda.", "warning");
              }

            }else{
              Swal.fire("Usuario no Identificado", "El usuario y/o contraseña no son correctas.", "warning");
              this.router.navigate(['/login']);
            }
          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }else{
      this.router.navigate(['/login']);
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
              
              this.listaModuloRolByRol();
            }else{
              localStorage.clear();
              Swal.fire("Error en la Autentificacion", datos[0]["observacion_salida"], "warning");
            }
          }else{
            localStorage.clear();
              Swal.fire("Error en la Autentificacion", "La autentificacion de Usuario a fallado, por seguridad se cerro la cuenta", "warning");
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
                
            localStorage.clear();

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
    Swal.fire({title: 'Buscando accesos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

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
          localStorage.removeItem("Panel Control")
          localStorage.removeItem("Usuarios")
          localStorage.removeItem("Sucursales")
          localStorage.removeItem("Parqueos")
          localStorage.removeItem("Clientes")
          localStorage.removeItem("Clientes - Todos")
          localStorage.removeItem("Configuracion")
          localStorage.removeItem("Notificacion")
          localStorage.removeItem("Talleres");
          localStorage.removeItem("Vehiculos");
          localStorage.removeItem("Blog");
          localStorage.removeItem("Importacion");
          localStorage.removeItem("Historias");
          
          for(i=0;i<datos.length;i++){
            localStorage.setItem(datos[i]["nombre"], "1"); 
          }

          this.panel_control = localStorage.getItem("Panel Control");
          this.usuarios = localStorage.getItem("Usuarios");
          this.sucursales = localStorage.getItem("Sucursales");
          this.parqueos = localStorage.getItem("Parqueos");
          this.clientes = localStorage.getItem("Clientes");
          this.clientes_todos = localStorage.getItem("Clientes - Todos");
          this.configuracion = localStorage.getItem("Configuracion");
          this.notificaciones = localStorage.getItem("Notificacion");
          this.talleres = localStorage.getItem("Talleres");
          this.vehiculos = localStorage.getItem("Vehiculos");
          this.blog = localStorage.getItem("Blog");
          this.importacion = localStorage.getItem("Importacion");
          this.historias = localStorage.getItem("Historias");

          if(localStorage.getItem("sucursal") == undefined){
            localStorage.setItem("sucursal", ""); 
          }

          this.listaSucursalByIdRol();
          this.obtenerIpCliente();
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

  listaSucursalByIdRol(){
    Swal.fire({title: 'Buscando sucursales',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "estado": 1,
      "id_rol": localStorage.getItem("id_rol")
    };

    this.http.post(this.url + "sucursal/listaSucursalByIdRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaSucursal = datos;
          
          if(localStorage.getItem("sucursal") != undefined){
            this.id_sucursal = localStorage.getItem("sucursal");
            this.id_sucursal_enc = encryptNumber(this.id_sucursal);
          }
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  change_sucursal(){
    localStorage.setItem("sucursal", this.id_sucursal); 
  }

  obtenerIpCliente(){
    Swal.fire({title: 'Extayendo informacion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {};
    this.http.get("https://api.ipify.org?format=json", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      var ua = navigator.userAgent;
      let deviceInfo = this.deviceService.getDeviceInfo();
      let device = "";
      const isMobile = this.deviceService.isMobile();
      const isTablet = this.deviceService.isTablet();
      const isDesktopDevice = this.deviceService.isDesktop();
      if(isMobile){
        device = "Movil"
      }
      if(isTablet){
        device = "Tablet"
      }
      if(isDesktopDevice){
        device = "Computadora"
      }

      localStorage.setItem("dispositivo", datos_recibidos.ip + ", " + device + ", " + ua)
    });
  }
}