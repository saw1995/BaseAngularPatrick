import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { ServicioParqueoService } from 'src/app/services/servicio-parqueo.service';


@Component({
  selector: 'app-parqueo-modulo',
  templateUrl: './parqueo-modulo.component.html',
  styleUrls: ['./parqueo-modulo.component.css']
})
export class ParqueoModuloComponent implements OnInit, AfterViewInit {
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url : any;

  id_compra:string = "";
  id_sucursal:string = "1"
  id_parqueo:string = '';
  nombre_almacen:string = '';
  descripcion_almacen:string = '';

  showModalAgregarCompra:boolean = false;

  nombre_sucursal = '';
  nombre_parqueo = '';
  descripcion_parqueo = '';
  concepto = '';

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servcioParqueo: ServicioParqueoService) { }

  ngOnInit(): void {
    this.url = globals.url;
    this.recuperarDatosParqueo();
  }

  ngAfterViewInit(): void {
    setTimeout(()=>{    
      this.recuperarDatosParqueo();
    }, 500);
  }

  click_listaPanel(){
    this.router.navigate(['/parqueo/panel/', encryptNumber(this.id_sucursal), encryptNumber(this.id_parqueo)]);
  }

  click_listaVehiculos(){
    this.router.navigate(['/parqueo/vehiculo/', encryptNumber(this.id_sucursal), encryptNumber(this.id_parqueo)]);
  }

  click_listaGastos(){
    this.router.navigate(['/parqueo/gasto/', encryptNumber(this.id_sucursal), encryptNumber(this.id_parqueo)]);
  }

  click_agregarTraspaso(){
    this.router.navigate(['/almacen/traspaso/agregar/', encryptNumber(this.id_sucursal), encryptNumber(this.id_parqueo)]);
  }

  click_listaTraspaso(tipo:string){
    if(tipo === "entrada"){
      this.router.navigate(['/parqueo/entradas/', encryptNumber(this.id_parqueo)]);
    }else{
      this.router.navigate(['/parqueo/salidas/', encryptNumber(this.id_parqueo)]);
    }
    
  }

  clickAbrirNuevaCompra()
  {
    this.concepto = '';
    this.showModalAgregarCompra = true;
  }

  recuperarDatosParqueo()
  {
    this.id_parqueo = this.servcioParqueo.getIdParqueo();
    if(this.id_parqueo != ""){
      this.parqueoById();
    }
  }

  agregarCompra(){
    //agregarCompra(id_almacen, id_usuario, id_proveedor, concepto, id_factura_compra, estado, id_empresa)
    if(this.id_parqueo == "")
    {
      Swal.fire("Error al validar los datos", "No se pudo obtener datos del almacen seleccionado, intente nuevamente. . .", "warning");
    }else if(this.concepto == "")
    {
      Swal.fire("Error al validar los datos", "El campto concepto de compra no puede estar vacío agregue almenos una descripcion, intente nuevamente . . .", "warning");
    }
    else
    {
      let parametros = {
        "id_almacen": this.id_parqueo,
        'id_usuario': localStorage.getItem("id_usuario"),
        'id_proveedor': '1',
        'concepto': this.concepto,
        'id_factura_compra': '1',
        'estado': 1,
        'id_empresa': localStorage.getItem("id_empresa")
      };
  
      Swal.fire({title: 'Agregando Compra',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "compra/agregarCompra", parametros).subscribe((datos_recibidos:any) => 
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
              this.cerrarModal.nativeElement.click();
              this.showModalAgregarCompra = false;
              this.id_compra = datos.id_compra + "";
              this.router.navigate(['/almacen/compra-detalle/agregar/', encryptNumber(this.id_parqueo), encryptNumber(this.id_compra)]);
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

  parqueoById(){
    Swal.fire({title: 'Extrayendo informacion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    let parametros = {
      'id_parqueo': this.id_parqueo
    };

    this.http.post(this.url+"parqueo/parqueoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.id_sucursal = datos[0].id_sucursal;
          if(this.id_sucursal != "1"){
            this.nombre_sucursal = "Sucursal " + datos[0].sucursal;
          }else{
            this.nombre_sucursal = datos[0].sucursal;
          }
          
          this.nombre_parqueo = datos[0].nombre;
          this.descripcion_parqueo = datos[0].descripcion;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

}
