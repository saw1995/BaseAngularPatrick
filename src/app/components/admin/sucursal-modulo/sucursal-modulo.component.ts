import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';

@Component({
  selector: 'app-sucursal-modulo',
  templateUrl: './sucursal-modulo.component.html',
  styleUrls: ['./sucursal-modulo.component.css']
})
export class SucursalModuloComponent implements OnInit {

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;

  url : any;

  showModalAsignarAlmacen:boolean = false;
  showModalVistaAreliShop:boolean = false;
  
  id_sucursal:string = ""
  nombre_sucursal:string = '';
  direccion_sucursal:string = '';
  foto_sucursal:string = 'sin_imagen_sucursal.jpg';
  areli_shop:boolean = false;

  id_almacen_seleccionado:string = '';

  listaAlmacenVenta:any;

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servcioSucursal: ServicioSucursalService) { }

  ngOnInit(): void {
    this.url = globals.url;
    this.recuperarDatosAlmacen();
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{    
      this.recuperarDatosAlmacen();
    }, 500);
  }

  click_listaPanel(){
    this.router.navigate(['/sucursal/panel/', encryptNumber(this.id_sucursal)]);
  }

  click_listaRecepcion(){
    this.router.navigate(['/sucursal/recepcion/', encryptNumber(this.id_sucursal)]);
  }
  
  click_listaDevolucion(){
    this.router.navigate(['/sucursal/devolucion/', encryptNumber(this.id_sucursal)]);
  }

  click_listaParqueo(){
    this.router.navigate(['/sucursal/parqueo/', encryptNumber(this.id_sucursal)]);
  }

  click_listaVenta(){
    this.router.navigate(['/sucursal/venta/', encryptNumber(this.id_sucursal)]);
  }
  
  click_verificacionPago(){
    this.router.navigate(['/sucursal/verificacion/', encryptNumber(this.id_sucursal)]);
  }

  click_importacion(){
    this.router.navigate(['/sucursal/importacion/', encryptNumber(this.id_sucursal)]);
  }

  click_contrato_garantia(){
    this.router.navigate(['/sucursal/contratogarantia/', encryptNumber(this.id_sucursal)]);
  }

  click_recibo_pago(){
    this.router.navigate(['/sucursal/recibopago/', encryptNumber(this.id_sucursal)]);
  }

  click_devolucion_pago(){
    this.router.navigate(['/sucursal/devolucionpago/', encryptNumber(this.id_sucursal)]);
  }

  click_abrirModalAsignarAlmacen(){
    this.showModalAsignarAlmacen = true;
    this.almacenVentaSucursalBySucursalVenta();
  }

  click_abrirModalArelisShopHabilitar(){
    this.showModalVistaAreliShop = true;
  }

  recuperarDatosAlmacen()
  {
    this.id_sucursal = this.servcioSucursal.getIdSucursal();
    if(this.id_sucursal != ""){
      this.sucursalById();
      //this.listaAlmacenVentaSucursalBySucursal();
    }
  }

  click_rbHabilitado(){
    this.areli_shop = true;
  }

  click_rbDeshabilitado(){
    this.areli_shop = false;
  }

  actualizarAreliShopBySucursalEmpresa(){
    //actualizarAreliShopBySucursalEmpresa(areli_shop, id_sucursal, id_empresa)
    Swal.fire({title: 'Actualizando datos. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      let validaAreliShop = this.areli_shop == true ? '1' : '0';
      let parametros = {
        "areli_shop": validaAreliShop,
        "id_empresa": localStorage.getItem("id_empresa"),
        'id_sucursal': this.id_sucursal
      };

      this.http.post(this.url+"sucursal/actualizarAreliShopBySucursalEmpresa", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.cerrarModal.nativeElement.click();
              this.showModalVistaAreliShop = false;
              this.sucursalById();
            }
            
          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });

  }


  actualizarVentaAlmacenByAlmacen(){
    
    if(this.id_almacen_seleccionado != "")
    {
      Swal.fire({title: 'Actualizando datos. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      let parametros = {
        "venta": 1,
        "id_almacen":  this.id_almacen_seleccionado,
        "id_empresa": localStorage.getItem("id_empresa"),
        "estado": 1,
        'id_sucursal': this.id_sucursal
      };

      this.http.post(this.url+"almacen/actualizarVentaAlmacenByAlmacen", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.cerrarModal.nativeElement.click();
              this.showModalAsignarAlmacen = false;
            }
            
          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });

    }
    else{
      Swal.fire("Error en validar datos", "Error en asignar el almacen este debe ser uno valido", "warning");
    }
    
  }

  listaAlmacenVentaSucursalBySucursal(){
    
    Swal.fire({title: 'Buscando datos almacen. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "id_empresa": localStorage.getItem("id_empresa"),
      "estado": 1,
      'id_sucursal': this.id_sucursal
    };

    this.http.post(this.url+"almacen/listaAlmacenVentaSucursalBySucursal", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          this.listaAlmacenVenta = datos;
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
    
  }

  
  almacenVentaSucursalBySucursalVenta(){

    Swal.fire({title: 'Buscando datos almacen. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    let parametros = {
      "id_empresa": localStorage.getItem("id_empresa"),
      "estado": 1,
      "venta": 1,
      'id_sucursal': this.id_sucursal
    };

    this.http.post(this.url+"almacen/almacenVentaSucursalBySucursalVenta", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      console.log(datos_recibidos);
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.id_almacen_seleccionado = datos[0].id;
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
    
  }


  sucursalById(){
    Swal.fire({title: 'Extrayendo informacion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    let parametros = {
      'id_empresa': localStorage.getItem("id_empresa"),
      'id': this.id_sucursal
    };

    this.http.post(this.url+"sucursal/sucursalById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
    
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.areli_shop = datos[0].arelishop == '1' ? true:false;
          this.nombre_sucursal = datos[0].nombre;
          this.foto_sucursal = datos[0].foto;
          this.direccion_sucursal = datos[0].departamento + " - zona " + datos[0].zona + ", av. " + datos[0].avenida + ", calle " + datos[0].calle;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }


}
