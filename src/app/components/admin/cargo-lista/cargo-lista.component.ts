import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cargo-lista',
  templateUrl: './cargo-lista.component.html',
  styleUrls: ['./cargo-lista.component.css']
})
export class CargoListaComponent implements OnInit {
  
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;

  url:string = globals.url;
  
  showModalAgregarCargo:boolean = false;
  showModalListaSucursalNoAgregado:boolean = false;
  showModalListaAlmacenesNoAgregados:boolean = false;
  showModalListaModulosNoAgregados:boolean = false;

  nombre_cargo_seleccionado:string = '';
  idRolSeleccionado:string = '';

  nombre_cargo:string = '';

  listaRol:any;

  listaSucursal:any;
  listaAlmacen:any;
  listaModulo:any;
  listaTiendaCategoria:any;

  listaSucursalNoAgregado:any;
  listaAlmacenNoAgregado:any;
  listaModuloNoAgregado:any;
  listaCategoriaClienteNoAgregado:any;

  constructor(private http: HttpClient, public router: Router) { }

  ngOnInit(): void {

    this.listaRolByEstado();

  }

  clickAbrirCargo(){
    this.showModalAgregarCargo = true;
  }

  clickAbrirModalListaSucursalNoAgregado(){
    if(this.idRolSeleccionado != '')
    {
    this.listaSucursalRolNoRegistradoByRol();
    this.showModalListaSucursalNoAgregado = true;}
  }

  clickAbrirModalListaAlmacenNoAgregado(){
    if(this.idRolSeleccionado != '')
    {
    this.listaParqueoRolNoRegistradoByRol();
    this.showModalListaAlmacenesNoAgregados = true;}
  }

  clickAbrirModalListaModuloNoAgregado(){
    if(this.idRolSeleccionado != '')
    {
    this.listaModuloRolNoRegistradoByRol();
    this.showModalListaModulosNoAgregados = true;}
  }

  clickCargarDatosByRol(_idRol:string, _rol:string){
    this.idRolSeleccionado = _idRol;
    this.nombre_cargo_seleccionado = _rol.toUpperCase();

    this.listaSucursalByIdRol(_idRol);
    this.listaParqueoByIdSucursalByRol(_idRol);
    this.listaModuloRolByRol(_idRol);
  }

  agregarRol(){

    if(this.nombre_cargo == '')
    {
      Swal.fire("Error validación de datos. . .", "El Campo nombre cargo no puede estar vacío. . .", "warning");
    }
    else
    {
      Swal.fire({title: 'Agregando Cargo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      
      let parametros = {
        "nombre": this.nombre_cargo,
        "estado": 1,
        "hr_latitud": '0',
        'hr_longitud': '0',
        'hr_dispositivo': localStorage.getItem('dispositivo'),
        'hr_id_usuario': localStorage.getItem('id_usuario')
      };
  
      this.http.post(this.url + "rol/agregarRol", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaRolByEstado();
              this.showModalAgregarCargo = false;
              this.cerrarModal.nativeElement.click();
            }
          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }
    
  }

  agregarSucursalRol(_idSucursal:string){
    Swal.fire({title: 'Agregando acceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      
    let parametros = {
      "id_sucursal": _idSucursal,
      "id_rol": this.idRolSeleccionado
    };

    this.http.post(this.url + "sucursal/agregarSucursalRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaSucursalByIdRol(this.idRolSeleccionado);
            this.showModalListaModulosNoAgregados = false;
            this.cerrarModal.nativeElement.click();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
    
  }

  agregarParqueoRol(_idParqueo:string){
    Swal.fire({title: 'Agregando acceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    //id_parqueo, id_rol, hr_latitud, hr_longitud, hr_dispositivo, hr_id_usuario
    let parametros = {
      "id_parqueo": _idParqueo,
      "id_rol": this.idRolSeleccionado,
      "hr_latitud": '0',
      "hr_longitud": '0',
      "hr_dispositivo": localStorage.getItem("dispositivo"),
      "hr_id_usuario": localStorage.getItem("id_usuario")
    };

    this.http.post(this.url + "parqueo/agregarParqueoRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaParqueoByIdSucursalByRol(this.idRolSeleccionado);
            this.showModalListaAlmacenesNoAgregados = false;
            this.cerrarModal.nativeElement.click();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
    
  }


  agregarRolModulo(_idModulo:string){
    
    Swal.fire({title: 'Agregando acceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    let parametros = {
      "id_modulo": _idModulo,
      "estado": 1,
      "id_rol": this.idRolSeleccionado,
      "hr_latitud": '0',
      "hr_longitud": '0',
      "hr_dispositivo": localStorage.getItem("dispositivo"),
      "hr_id_usuario": localStorage.getItem("id_usuario")
    };

    this.http.post(this.url + "rol/agregarRolModulo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaModuloRolByRol(this.idRolSeleccionado);
            this.showModalListaModulosNoAgregados = false;
            this.cerrarModal.nativeElement.click();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
    
  }

  eliminarSucursalRolById(_idSucursal:string){
    
    Swal.fire({title: 'Eliminando acceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_sucursal": _idSucursal,
      "id_rol": this.idRolSeleccionado
    };
    
    this.http.post(this.url + "sucursal/eliminarSucursalRolById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaSucursalByIdRol(this.idRolSeleccionado);
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
    
  }

  eliminarRolParqueo(_idParqueo:string){
    
    Swal.fire({title: 'Eliminando acceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}}); 
    let parametros = {
      "id_parqueo": _idParqueo,
      "id_rol": this.idRolSeleccionado
    };

    this.http.post(this.url + "parqueo/eliminarRolParqueo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaParqueoByIdSucursalByRol(this.idRolSeleccionado);
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
    
  }

  eliminarRolModulo(_idModulo:string){
    
    Swal.fire({title: 'Eliminando acceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_rol": this.idRolSeleccionado,
      "id_modulo": _idModulo
    };

    this.http.post(this.url + "rol/eliminarRolModulo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaModuloRolByRol(this.idRolSeleccionado);
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
    
  }


  listaRolByEstado(){
    Swal.fire({title: 'Buscando cargos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = { "estado": 1 };

    this.http.post(this.url + "rol/listaRolByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaRol = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaSucursalByIdRol(_idRol:string){
    let parametros = { "estado": 1, "id_rol": _idRol };
    Swal.fire({title: 'Buscando sucursales',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    this.http.post(this.url + "sucursal/listaSucursalByIdRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaSucursal = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaParqueoByIdSucursalByRol(_idRol:string){
    let parametros = {
      "estado": 1, 
      "id_sucursal": 1, 
      "id_rol": _idRol
    };
    Swal.fire({title: 'Buscando almacenes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    this.http.post(this.url + "parqueo/listaParqueoByIdSucursalByRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaAlmacen = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaModuloRolByRol(_idRol:string){
    let parametros = { "id_rol": _idRol };
    Swal.fire({title: 'Buscando modulos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    this.http.post(this.url + "rol/listaModuloRolByRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaModulo = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaSucursalRolNoRegistradoByRol(){
    let parametros = { "estado": 1,"id_rol": this.idRolSeleccionado };
    Swal.fire({title: 'Buscando sucursales',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    this.http.post(this.url + "sucursal/listaSucursalRolNoRegistradoByRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaSucursalNoAgregado = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
  
  listaParqueoRolNoRegistradoByRol(){
    
    let parametros = {
      "estado": 1,
      "id_rol": this.idRolSeleccionado
    };

    Swal.fire({title: 'Buscando parqueos. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    this.http.post(this.url + "parqueo/listaParqueoRolNoRegistradoByRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaAlmacenNoAgregado = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaModuloRolNoRegistradoByRol(){
    let parametros = { "id_rol": this.idRolSeleccionado };
    Swal.fire({title: 'Buscando modulos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    this.http.post(this.url + "rol/listaModuloRolNoRegistradoByRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaModuloNoAgregado = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

}
