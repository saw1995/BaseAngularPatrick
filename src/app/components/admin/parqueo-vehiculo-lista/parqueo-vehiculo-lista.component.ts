import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { ServicioParqueoService } from 'src/app/services/servicio-parqueo.service';

@Component({
  selector: 'app-parqueo-vehiculo-lista',
  templateUrl: './parqueo-vehiculo-lista.component.html',
  styleUrls: ['./parqueo-vehiculo-lista.component.css']
})
export class ParqueoVehiculoListaComponent implements OnInit {
  
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;

  url : any;

  id_sucursal:string = "1"
  id_parqueo:string = '';

  capacidad:number = 0;

  id_sucursal_parqueo_receptor:any = ""
  id_parqueo_receptor:any = ""
  observacion_parqueo_receptor:any = "";

  id_parqueo_vehiculo_seleccionado:string = '';
  id_vehiculo_seleccionado:string ='';
  vehiculo_seleccionado:string = '';

  listaSucursal:any = [];
  listaVehiculos:any = []
  listaParqueo:any = []

  showModalTraspaso:boolean = false;
  showModalAgregarGasto:boolean = false;

  concepto_gasto:string = '';
  subtotal_gasto:number = 0;
  observacion_gasto:string = '';

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioparqueo: ServicioParqueoService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Sucursales") != undefined){
      this.url = globals.url;
      this.id_parqueo = decryptNumber(this.route.snapshot.paramMap.get("id_parqueo"));
      this.servicioparqueo.setIdParqueo(this.id_parqueo);
      
      this.listaVehiculoByParqueo()
      this.listaSucursalByIdRol();
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  click_traspaso(_id_parqueo_vehiculo:string, _idVehiculo:string, _clase:string, _marca:string, _tipo:string, _version:string, _anho:string){
    this.id_parqueo_vehiculo_seleccionado = _id_parqueo_vehiculo;
    this.id_vehiculo_seleccionado = _idVehiculo;
    this.vehiculo_seleccionado = _clase + ' ' + _marca + ' ' + _tipo + ' ' + _version + ' ' + _anho;
    this.showModalTraspaso = true;
  }

  traspasarVehiculo(){
    if(this.id_parqueo_receptor != "" && this.observacion_parqueo_receptor)
    {
      if(this.id_parqueo_receptor != this.id_parqueo)
      {
        this.actualizarParqueoVehiculoToSalida(this.id_parqueo_vehiculo_seleccionado, this.id_vehiculo_seleccionado);
      }
      else{
        Swal.fire("Error en validacion", 'No puede seleccionar el mismo parqueo en el que se encuentra este vehiculo. . .', "warning");
      }
    }
  }

  click_agregarGastoModal(_id_parqueo_vehiculo:string, _idVehiculo:string, _clase:string, _marca:string, _tipo:string, _version:string, _anho:string){
    this.id_parqueo_vehiculo_seleccionado = _id_parqueo_vehiculo;
    this.id_vehiculo_seleccionado = _idVehiculo;
    this.vehiculo_seleccionado = _clase + ' ' + _marca + ' ' + _tipo + ' ' + _version + ' ' + _anho;

    this.showModalAgregarGasto = true;
  }

  agregarGastoVehiculo(){

    if(this.concepto_gasto == ""){
      Swal.fire("Error validación datos", 'El Campo concepto no puede estar vacío. . .', "warning");
    }
    else if(this.subtotal_gasto <= 0){
      Swal.fire("Error validación datos", 'El Campo subtotal no puede ser menor o igual a cero. . .', "warning");
    }
    else{

      Swal.fire({title: 'Registrando gasto. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
      let parametros = {
        'id_vehiculo': this.id_vehiculo_seleccionado,
        'id_usuario': localStorage.getItem('id_usuario'),
        'concepto': this.concepto_gasto,
        'subtotal': this.subtotal_gasto,
        'observacion': this.observacion_gasto,
        'foto': 'sin_imagen_gastro.jpg'
      };

      this.http.post(this.url+"vehiculo/agregarGastoVehiculo", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];

        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.showModalAgregarGasto = false;
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

  actualizarParqueoVehiculoToSalida(_id_parqueo_vehiculo:string, _idVehiculo:string){
    Swal.fire({title: 'Buscando Recepcion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    let parametros = {
      'id_usuario_salida': localStorage.getItem('id_usuario'),
      'id_sucursal':this.id_sucursal,
      'id_parqueo': this.id_parqueo,
      'id_vehiculo': _idVehiculo,
      'observacion_salida': this.observacion_parqueo_receptor,
      'id_parqueo_vehiculo': _id_parqueo_vehiculo,
      'hr_latitud': '0',
      'hr_longitud': '0',
      'hr_dispositivo': localStorage.getItem('dispositivo')
    };

    this.http.post(this.url+"parqueo/actualizarParqueoVehiculoToSalida", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.agregarParqueoVehiculoEntrada(_idVehiculo);
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
  
  agregarParqueoVehiculoEntrada(_idVehiculo:string){
    Swal.fire({title: 'Buscando Recepcion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    let parametros = {
      'id_parqueo': this.id_parqueo_receptor,
      'id_sucursal':this.id_sucursal,
      'id_vehiculo': _idVehiculo,
      'id_usuario_entrada': localStorage.getItem('id_usuario'),
      'observacion_entrada': 'traspaso: ' + this.observacion_parqueo_receptor,
      'hr_latitud': '0',
      'hr_longitud': '0',
      'hr_dispositivo': localStorage.getItem('dispositivo')
    };

    this.http.post(this.url+"parqueo/agregarParqueoVehiculoEntrada", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaVehiculoByParqueo();
            this.cerrarModal.nativeElement.click();
            this.showModalTraspaso = false;
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
  
  recepcionByVehiculo(id_vehiculo:any){
    Swal.fire({title: 'Buscando Recepcion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    let parametros = {
      'id_vehiculo': id_vehiculo
    };

    this.http.post(this.url+"recepcion/recepcionByVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          let id_recepcion = datos[0]["id_recepcion"] + "";
          this.router.navigate(['/sucursal/recepcion/detalle/', encryptNumber(this.id_sucursal), encryptNumber(id_recepcion)]);

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaVehiculoByParqueo(){
    Swal.fire({title: 'Buscando Vehiculos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    let parametros = {
      'id_parqueo': this.id_parqueo,
      'entrada_salida': '1'
    };

    this.http.post(this.url+"parqueo/listaVehiculoByParqueo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaVehiculos = datos;

          for(let i=0;i<this.listaVehiculos.length;i++){
            let imagenes = this.listaVehiculos[i].foto.split(",");
            this.listaVehiculos[i].foto = imagenes;
          }
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaSucursalByIdRol()
  {
    Swal.fire({title: 'Buscando Sucursales',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1,
      "id_rol": localStorage.getItem("id_rol")
    };
    this.http.post(this.url+"sucursal/listaSucursalByIdRol", parametros).subscribe((datos_recibidos:any) => {
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

  listaParqueoByIdSucursalByRol()
  {
    this.listaParqueo = [];

    Swal.fire({title: 'Buscando Parqueos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1,
      "id_rol": localStorage.getItem("id_rol"),
      "id_sucursal": this.id_sucursal_parqueo_receptor
    };
    this.http.post(this.url+"parqueo/listaParqueoByIdSucursalByRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaParqueo = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
