import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';

@Component({
  selector: 'app-paequeo-lista',
  templateUrl: './parqueo-lista.component.html',
  styleUrls: ['./parqueo-lista.component.css']
})
export class ParqueoListaComponent implements OnInit {
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;

  url:string = globals.url;
  
  showModalAgregarCompra:boolean = false;
  showModalAgregarParqueo:boolean = false;
  showModalActualizarParqueo:boolean = false;

  id_sucursal:string = "1"
  id_parqueo:string = '';
  nombre_sucursal:any = "Indenpendientes";

  nombre:string = '';
  descripcion:string = '';
  capacidad:string = '';
  
  actualizar_id:string = '';
  actualizar_nombre:string = '';
  actualizar_descripcion:string = '';

  seleccion_id:string = '';
  seleccion_nombre:string = '';
  seleccion_descripcion:string = '';

  listaSucursal:any[] = [];
  listaParqueo:any[] = [];

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioSucursal: ServicioSucursalService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Parqueos") != undefined){
      this.url = globals.url;  
      this.id_sucursal = decryptNumber(this.route.snapshot.paramMap.get("id_sucursal"));
      this.servicioSucursal.setIdSucursal(this.id_sucursal);

      if(this.id_sucursal == "1"){
        this.nombre_sucursal = "Indenpendientes"
      }else{
        this.sucursalById();
      }
      this.listaParqueoByIdSucursalByRol();
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  agregarParqueo()
  {
    if(this.nombre == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre parqueo no puede ser vacío.", "warning");
    }else if(this.descripcion == "")
    {
      Swal.fire("Error al validar los datos", "El campo descripción parqueo no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        "id_sucursal": this.id_sucursal,
        'nombre': this.nombre,
        'descripcion': this.descripcion,
        'latitud': '0',
        'longitud': '0',
        'venta': '1',
        'capacidad': this.capacidad,
        'id_rol': localStorage.getItem("id_rol"),
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
  
      Swal.fire({title: 'Agregando Parqueo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "parqueo/agregarParqueo", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
        console.log(datos_recibidos);
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              //this.id_parqueo = datos.id_parqueo;
              this.cerrarModal.nativeElement.click();
              this.showModalAgregarParqueo = false;
              this.listaParqueoByIdSucursalByRol();
            }
          }
          else
          {
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }
        else
        {
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }
  }

  actualizarDatosParqueo(){

    if(this.actualizar_nombre == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre parqueo no puede ser vacío.", "warning");
    }else if(this.actualizar_descripcion == "")
    {
      Swal.fire("Error al validar los datos", "El campo descripción parqueo no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        "id_sucursal": '1',
        'nombre': this.actualizar_nombre,
        'descripcion': this.actualizar_descripcion,
        'latitud': '0',
        'longitud': '0',
        'id_empresa': localStorage.getItem("id_empresa"),
        'id': this.actualizar_id
      };
  
      Swal.fire({title: 'Ejecutando la petición',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "parqueo/actualizarDatosParqueo", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
        console.log(datos_recibidos);
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaParqueoByIdSucursalByRol();
              this.cerrarModal.nativeElement.click();
              this.showModalActualizarParqueo = false;
            }
          }
          else
          {
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }
        else
        {
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }
  }

  listaParqueoByIdSucursalByRol()
  {
    Swal.fire({title: 'Buscando parqueos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1,
      'id_sucursal': this.id_sucursal,
      'id_rol': localStorage.getItem("id_rol")
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

  sucursalById()
  {
    Swal.fire({title: 'Buscando parqueos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id': this.id_sucursal,
    };
    this.http.post(this.url+"sucursal/sucursalById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaSucursal = datos;
          this.nombre_sucursal = "de la sucursal " + this.listaSucursal[0]["nombre"]
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  click_agregarParqueo(){
    this.nombre = '';
    this.descripcion = '';
    this.showModalAgregarParqueo = true;
  }

  clickAgrgarCompra(){
    this.showModalAgregarCompra = true;
  }

  clickSeleecionarParqueo(_id:string, _nombre:string, _descripcion:string){
    this.seleccion_id = _id;
    this.seleccion_nombre = _nombre;
    this.seleccion_descripcion = _descripcion;
    this.router.navigate(['/parqueo/panel/', encryptNumber(this.id_sucursal), encryptNumber(this.seleccion_id)]);
  }

  clickActualizarParqueo(_id:string, _nombre:string, _descripcion:string){
    this.actualizar_id = _id;
    this.actualizar_nombre = _nombre;
    this.actualizar_descripcion = _descripcion;

    this.showModalActualizarParqueo = true;
  }

  click_listaCompra(){
    this.router.navigate(['/parqueo/compra', encryptNumber(this.seleccion_id)]);
  }

  click_listaTraspaso(tipo:string){
    if(tipo === "entrada"){
      this.router.navigate(['/parqueo/traspaso-entrada/', tipo, encryptNumber(this.id_sucursal), encryptNumber(this.seleccion_id)]);
    }else{
      this.router.navigate(['/parqueo/traspaso-salida/', tipo, encryptNumber(this.id_sucursal), encryptNumber(this.seleccion_id)]);
    }
    
  }

  click_listaStock(){
    this.router.navigate(['/parqueo/stock/', encryptNumber(this.seleccion_id)]);
  }
}
