import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { decryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-importacion-detalle',
  templateUrl: './importacion-detalle.component.html',
  styleUrls: ['./importacion-detalle.component.css']
})
export class ImportacionDetalleComponent implements OnInit {

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  @ViewChild('cerrarModalAgregarTaller') cerrarModalAgregarTaller:any = ElementRef;
  @ViewChild('cerrarModalReciboNuevo') cerrarModalReciboNuevo:any = ElementRef;
  @ViewChild('cerrarModalImagen') cerrarModalImagen:any = ElementRef;

  url:string = globals.url;
  
  showAgregarProcesoImportacion:boolean = false;
  showModalAgregarPago:boolean = false;
  showListaPagos:boolean = false;
  showAgregarTaller:boolean = false;
  showModalReciboNuevo:boolean = false;
  showModalReciboDetalle:boolean = false;

  id_sucursal:any;
  id_vehiculo:any;
  id_cotizacion:any;
  id_cliente:any;

  id_recibo:any = '';
  nro_recibo:any = '';
  recibo_verificado:any = '';
  total_recibo:any = '';
  detalle_recibo:any = '';
  tipo_recibo:any = '';
  tipo_pago:any = '';
  observacion_recibo:any = '';
  usuario_verificado_recibo:any = '';
  fecha_verificado_recibo:any = '';
  hora_verificado_recibo:any = '';
  usuario_recibo:any = '';
  fecha_recibo:any = '';
  hora_recibo:any = '';
  respaldo:any = '';

  usuario:any = "";
  fecha:any = "";
  hora:any = "";
  observacion_importacion:any = "";
  sucursal:any = "";
  cliente:any = "";
  ci:any = "";
  direccion:any = "";
  telefono:any = "";

  vehiculo:any = "";
  pais:any = "";
  traccion:any = "";
  color:any = "";
  motor:any = "";
  caja:any = "";
  cilindrada:any = "";
  nro_puerta:any = "";
  kilometraje:any = "";
  placa:any = "";
  nro_copia:any = "";
  precio_propietario:any = "";
  precio_venta:any = "";
  observacion_vehiculo:any = "";
  plataforma:any = "";
  link:any = "";
  


  corte10:any = 0;
  corte20:any = 0;
  corte50:any = 0;
  corte100:any = 0;
  corte200:any = 0;
  corteDolar1:any = 0;
  corteDolar2:any = 0;
  corteDolar5:any = 0;
  corteDolar10:any = 0;
  corteDolar20:any = 0;
  corteDolar50:any = 0;
  corteDolar100:any = 0;

  subTotal10:any = 0;
  subTotal20:any = 0;
  subTotal50:any = 0;
  subTotal100:any = 0;
  subTotal200:any = 0;
  subTotalDolar1:any = 0;
  subTotalDolar2:any = 0;
  subTotalDolar5:any = 0;
  subTotalDolar10:any = 0;
  subTotalDolar20:any = 0;
  subTotalDolar50:any = 0;
  subTotalDolar100:any = 0;

  subTotalBolivianos:any = 0;
  subTotalDolares:any = 0;
  totalBolivianos:any = 0;
  totalDolares:any = 0;

  glosa:any = "";
  monto:any = "";
  moneda:any = "";
  nombre_origen:any = "";
  cuenta_origen:any = "";
  banco_origen:any = "";
  cuenta_destino:any = "";
  banco_destino:any = "";

  nombre_no_registrado:any = "";
  monto_no_registrado:any = "";


  imagen_vehiculo:any = [];

  id_cliente_seleccionado:string = '';
  cliente_seleccionado:string = '';

  id_importacion_vehiculo:string = '';
  nro_importacion_vehiculo:string = '';

  id_proceso_importacion:string = '';
  id_proceso_no_registrado:string = '';

  proceso_importacion:string = '';
  subtotal_importacion:number = 0;

  listaProceso:any = [];
  listaProcesoNoRegistrado:any = [];
  listaPagos:any = [];
  listaGastos:any = [];
  listaDetalle:any = [];
  listaCotizacionRepuesto:any = [];
  listaTaller:any = [];
  listaModelo:any = [];
  
  totalGasto:any = 0.00;
  totalImportacion:any = 0.00;
  totalCotizacion:any = 0.00;
  totalRepuesto:any = 0.00;
  totalDetalle:any = 0.00;
  total:any = 0.00;

  id_taller:any = "";
  id_taller_vehiculo:any = "";
  lblTallerAsignado:any = "";

  showModalImagen:Boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  listaImagenes: File[] = [];
  listaPrevia:any = [];
  variasImagenes:boolean = false;
  contadorImagen:any = 0;

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioSucursal: ServicioSucursalService, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {

    if(localStorage.getItem("Sucursales") != undefined){
      this.url = globals.url;  
      this.id_sucursal = localStorage.getItem("sucursal")
      this.id_importacion_vehiculo = decryptNumber(this.route.snapshot.paramMap.get("id_importacion"));

      this.servicioSucursal.setIdSucursal(this.id_sucursal);
      
      this.importacionById();
    }else{
      this.router.navigate(['/restriccion']);
    }

  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  click_cortarImagen(){
    this.compressFile(this.croppedImage, "imagen_categoria.jpg")
    this.showModalImagen = false;
    this.cerrarModalImagen.nativeElement.click();
    
  }
  compressFile(image:any,fileName:any) {
    var orientation = -1;
    this.imageCompress.compressFile(image, orientation, 75, 75).then(
    result => {
      this.createFile(result, fileName);
    });
  }

  async createFile(url:any, fileName:any){
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: 'image/jpeg'
    };
    const imageFile = new File([data], fileName, metadata);
    if(!this.variasImagenes){
      this.listaImagenes = []
      this.listaPrevia = []
    }
    this.listaPrevia.push(url);
    this.listaImagenes.push(imageFile);
  }

  click_agregarImagen(){
    this.showModalImagen = true;
  }

  calcularTotal(){
    this.subTotal10 = 10 * parseInt(this.corte10);
    this.subTotal20 = 20 * parseInt(this.corte20);
    this.subTotal50 = 50 * parseInt(this.corte50);
    this.subTotal100 = 100 * parseInt(this.corte100);
    this.subTotal200 = 200 * parseInt(this.corte200);
    
    this.subTotalDolar1 = 1 * parseInt(this.corteDolar1);
    this.subTotalDolar2 = 2 * parseInt(this.corteDolar2);
    this.subTotalDolar5 = 5 * parseInt(this.corteDolar5);
    this.subTotalDolar10 = 10 * parseInt(this.corteDolar10);
    this.subTotalDolar20 = 20 * parseInt(this.corteDolar20);
    this.subTotalDolar50 = 50 * parseInt(this.corteDolar50);
    this.subTotalDolar100 = 100 * parseInt(this.corteDolar100);

    this.subTotalBolivianos = parseInt(this.subTotal10) + parseInt(this.subTotal20) + parseInt(this.subTotal50) + parseInt(this.subTotal100) + parseInt(this.subTotal200)
    this.subTotalDolares = parseInt(this.subTotalDolar1) + parseInt(this.subTotalDolar2) + parseInt(this.subTotalDolar5) + parseInt(this.subTotalDolar10) + parseInt(this.subTotalDolar20) + parseInt(this.subTotalDolar50) + parseInt(this.subTotalDolar100)
  }

  click_abrirAgregarProceso(){
    this.listaProcesoModeloByEstado();
  }

  click_abrirListaPagos(){
    this.showListaPagos=true;
  }

  click_abrirAgregarTaller(){
    this.showAgregarTaller = true;
    this.listaTalleresByEstado();
  }

  click_irTallerDetalle(){
    this.router.navigate(['/taller/detalle', this.id_taller_vehiculo]);
  }

  click_generarRecibo(id:any, subTotal:any, detalle:any){
    this.id_proceso_importacion = id;
    this.total_recibo = subTotal;
    this.detalle_recibo = detalle;
    this.observacion_recibo = "";
    this.showModalReciboNuevo = true;
  }

  click_abrirReciboDetalle(id:any){
    this.listaReciboPagoById(id);
    this.showModalReciboDetalle = true;
  }

  click_abrirPagoProceso(_idProceso:string){
    this.corte10 ='';
    this.corte20=''
    this.corte50=''
    this.corte100=''
    this.corte200=''
    this.corteDolar1=''
    this.corteDolar2=''
    this.corteDolar5=''
    this.corteDolar10=''
    this.corteDolar20=''
    this.corteDolar50=''
    this.corteDolar100=''
    this.glosa=''
    this.monto=''
    this.moneda=''
    this.nombre_origen=''
    this.cuenta_origen=''
    this.banco_origen=''
    this.cuenta_destino=''
    this.banco_destino=''

    this.id_proceso_importacion = _idProceso;
    this.listaPagoProcesoImportacionByIdProcesoEstado();
    this.showModalAgregarPago = true;
  }

  change_montoProceso(){
    for(let i=0; i<this.listaProcesoNoRegistrado.length; i++){
      if(this.listaProcesoNoRegistrado[i]["id"] == this.id_proceso_no_registrado){
        this.nombre_no_registrado = this.listaProcesoNoRegistrado[i]["nombre"]
        this.monto_no_registrado = this.listaProcesoNoRegistrado[i]["monto"]
        break;
      }
    }
  }

  agregarTallerVehiculo(){
    Swal.fire({
      title: '¿Esta seguro de asignar el vehiculo con el Taller?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Asignar'
    }).then((result) => {
      if (result.isConfirmed) {
        let parametros = {
          "id_vehiculo": this.id_vehiculo,
          "id_taller": this.id_taller,
          "id_usuario": localStorage.getItem("id_usuario"),
        };
    
        Swal.fire({title: 'Asignando taller',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
        this.http.post(this.url + "taller/agregarTallerVehiculo", parametros).subscribe((datos_recibidos:any) => 
        {
          Swal.close();
          
          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              if(datos.affectedRows == 1){
                this.showAgregarTaller = false;
                this.cerrarModalAgregarTaller.nativeElement.click();
    
                this.tallerVehiculoByVehiculo()
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
    });
  }

  actualizarEstadoPagoByIdProceso(_idProceso:string){
    let parametros = {
      "estado_pago": 1,
      "id":_idProceso
    };

    Swal.fire({title: 'Guardando registro proceso. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "importacion/actualizarEstadoPagoByIdProceso", parametros).subscribe((datos_recibidos:any) => 
    {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1){
            this.listaProcesoImportacionByIdImportacion();
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

  agregarPagoImportacionPago(){

    if(this.glosa == "")
    {
      Swal.fire("Error al validar los datos", "Debe seleccionar un proceso para agregar. . .", "warning");
    }else if(this.monto <= 0)
    {
      Swal.fire("Error al validar los datos", "El campo subtotal debe ser un monto valido. . .", "warning");
    }
    else
    {
      let parametros = {
        "id_importacion_proceso": this.id_proceso_importacion,
        'id_usuario': localStorage.getItem('id_usuario'),
        'corte_boliviano_10': this.corte10,
        'corte_boliviano_20': this.corte20,
        'corte_boliviano_50': this.corte50,
        'corte_boliviano_100': this.corte100,
        'corte_boliviano_200': this.corte200,
        'corte_dolar_1': this.corteDolar1,
        'corte_dolar_2': this.corteDolar2,
        'corte_dolar_5': this.corteDolar5,
        'corte_dolar_10': this.corteDolar10,
        'corte_dolar_20': this.corteDolar20,
        'corte_dolar_50': this.corteDolar50,
        'corte_dolar_100': this.corteDolar100,
        'glosa': this.glosa,
        'monto': this.monto,
        'moneda': this.moneda,
        'nombre_origen': this.nombre_origen,
        'cuenta_origen': this.cuenta_origen,
        'banco_origen': this.banco_origen,
        'cuenta_destino': this.cuenta_destino,
        'banco_destino': this.banco_destino
      };
  
      Swal.fire({title: 'Guardando registro de pago. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "importacion/agregarPagoImportacionPago", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.cerrarModal.nativeElement.click();
              this.showModalAgregarPago = false;
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

  agregarImportacionProceso(){
    Swal.fire({
      title: '¿Esta seguro de agregar el Proceso?',
      html: "<b></b>",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        let parametros = {
          "id_vehiculo": this.id_vehiculo,
          'procesos': this.listaModelo,
          'id_usuario': localStorage.getItem('id_usuario')
        };
    
        Swal.fire({title: 'Guardando registro proceso. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
        this.http.post(this.url + "importacion/agregarImportacionProceso", parametros).subscribe((datos_recibidos:any) => 
        {
          Swal.close();
          
          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              if(datos.affectedRows == 1)
              {
                this.listaProcesoImportacionByIdImportacion();
                
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
      
    });
  }

  actualizarReciboPagoByIdProceso(id_recibo_pago:any, id_importacion_proceso:any){
    let parametros = {
      'id_recibo_pago': id_recibo_pago,
      'id': id_importacion_proceso
    };

    Swal.fire({title: 'Generando Recibo de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "importacion/actualizarReciboPagoByIdProceso", parametros).subscribe((datos_recibidos:any) => 
    {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.listaProcesoImportacionByIdImportacion();
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

  agregarReciboPago(){
    if(this.total_recibo == "")
    {
      Swal.fire("Campo Vacio", "Introduza el total del recibo de pago", "warning");
    }else if(this.tipo_pago == "")
    {
      Swal.fire("Campo Vacio", "Seleccione el tipo de Pago", "warning");
    }
    else
    {
      let parametros = {
        'id_cliente': this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"),
        'tipo': "Proceso de Importación",
        'detalle': this.detalle_recibo,
        'tipo_pago': this.tipo_pago,
        'observacion': this.observacion_recibo,
        'total': this.total_recibo,
        'respaldo': "sin_imagen_recibo.jpg",
        'estado': "1",
        'id_sucursal': this.id_sucursal
      };
  
      Swal.fire({title: 'Generando Recibo de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
      this.http.post(this.url + "recibo/agregarReciboPago", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.tipo_pago = "";
              this.detalle_recibo = "";
              this.observacion_recibo = "";

              if(this.listaImagenes.length > 0)
              {
                this.actualizarRespaldoReciboById(datos.id_recibo_pago);
              }else{
                this.total_recibo = ''
                this.cerrarModalReciboNuevo.nativeElement.click();
                this.showModalReciboNuevo = false;
                this.actualizarReciboPagoByIdProceso(datos.id_recibo_pago, this.id_proceso_importacion);
              } 
              
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

  actualizarRespaldoReciboById(id_recibo:string){
    const formData: FormData = new FormData();
    formData.append('imagen', this.listaImagenes[0]);
    this.http.post(
    this.url + "recibo/actualizarRespaldoReciboById/" + id_recibo,
    formData).subscribe((response:any) => {
      this.total_recibo = ''
      this.cerrarModalReciboNuevo.nativeElement.click();
      this.showModalReciboNuevo = false;
      this.actualizarReciboPagoByIdProceso(id_recibo, this.id_proceso_importacion);
    });
  }

  importacionById()
  {
    Swal.fire({title: 'Extrayendo Informacion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_importacion": this.id_importacion_vehiculo,
    };
    
    this.http.post(this.url+"importacion/importacionById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          console.log(datos[0]);
          this.nro_importacion_vehiculo = datos[0]["nro"]
          this.id_vehiculo = datos[0]["id_vehiculo"]

          this.usuario = datos[0]["usuario"]
          this.fecha = datos[0]["fecha"]
          this.hora = datos[0]["hora"]
          this.observacion_importacion = datos[0]["observacion_importacion"]
          this.sucursal = datos[0]["nombre_sucursal"]
          this.cliente = datos[0]["cliente"]
          this.ci = datos[0]["ci_cliente"]
          this.direccion = datos[0]["direccion_cliente"]
          this.telefono = datos[0]["celular_cliente"]

          this.vehiculo = datos[0]["clase_vehiculo"] + " " + datos[0]["nombre_marca"] + " " + datos[0]["tipo"] + " " + datos[0]["version"] + " " + datos[0]["anho"]
          this.pais = datos[0]["pais"]
          this.traccion = datos[0]["traccion"]
          this.color = datos[0]["color"]
          this.motor = datos[0]["motor"]
          this.caja = datos[0]["caja"]
          this.cilindrada = datos[0]["cilindrada"]
          this.nro_puerta = datos[0]["nro_puerta"]
          this.kilometraje = datos[0]["kilometraje"]
          this.placa = datos[0]["placa"]
          this.nro_copia = datos[0]["nro_copia"]
          this.precio_propietario = datos[0]["precio_propietario"]
          this.precio_venta = datos[0]["precio_sugerido"]
          this.observacion_vehiculo = datos[0]["observacion"]
          this.id_cotizacion = datos[0]["cotizacion"]
          this.id_cliente = datos[0]["id_cliente"]
          this.plataforma = datos[0]["plataforma"]
          this.link = datos[0]["link"]

          let imagenes = datos[0]['foto'].split(",");
          this.imagen_vehiculo = imagenes;

          this.listaCotizacionDetalleByEstado();
          this.listaCotizacionRepuestoByEstado();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaReciboPagoById(id_recibo:any){

    Swal.fire({title: 'Buscando Recibo de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_recibo_pago": id_recibo,
      "estado": "1"
    };
    this.http.post(this.url+"recibo/listaReciboPagoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.length > 0){
            this.id_recibo = datos[0]["id"];
            this.nro_recibo = datos[0]["nro_recibo_pago"];
            this.fecha_recibo = datos[0]["fecha"];
            this.hora_recibo = datos[0]["hora"];
            this.usuario_recibo = datos[0]["usuario"];
            this.total_recibo = datos[0]["total"];
            this.detalle_recibo = datos[0]["detalle"];
            this.observacion_recibo = datos[0]["observacion"];
            this.tipo_pago = datos[0]["tipo_pago"];
            this.tipo_recibo = datos[0]["tipo"];
            this.fecha_verificado_recibo = datos[0]["fecha_verificado"];
            this.hora_verificado_recibo = datos[0]["hora_verificado"];
            this.usuario_verificado_recibo = datos[0]["usuario_verificado"];
            this.respaldo = datos[0]["respaldo"];

            if(datos[0]["id_usuario_verificado"] == '1'){
              this.fecha_verificado_recibo = "- - -";
              this.hora_verificado_recibo = "- - -";
              this.usuario_verificado_recibo = "- - -";
            }

            this.recibo_verificado = "SIN VERIFICAR";
            if(datos[0]["verificado"] == '1'){
              this.recibo_verificado = "VERIFICADO";
            }
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaProcesoModeloByEstado()
  {
    Swal.fire({title: 'Buscando Procesos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'estado': "1",
    };
    this.http.post(this.url+"proceso/listaProcesoModeloByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaModelo = datos;

          let elemento:any = document.querySelector("#tablaModelo");
          elemento.style.display = 'block';
          elemento = document.querySelector("#btnActualizarProceso");
          elemento.style.display = 'block';
          elemento = document.querySelector("#btnAgregarProceso");
          elemento.style.display = 'none';

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaProcesoNoRegistradoByImportacion(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
      "estado": "1"
    };
    this.http.post(this.url+"importacion/listaProcesoNoRegistradoByImportacion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaProcesoNoRegistrado = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaCotizacionDetalleByEstado(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cotizacion": this.id_cotizacion,
      "estado": "1"
    };
    this.http.post(this.url+"cotizacion/listaCotizacionDetalleByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaDetalle = datos;

          this.totalDetalle = 0.00;
          for(let i=0; i<this.listaDetalle.length; i++){
            this.totalDetalle = parseFloat(this.totalDetalle) + parseFloat(this.listaDetalle[i]["monto"])
          }
          this.totalCotizacion = parseFloat(this.totalDetalle) + parseFloat(this.totalRepuesto)

          this.listaProcesoImportacionByIdImportacion();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaCotizacionRepuestoByEstado(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cotizacion": this.id_cotizacion,
      "estado": "1"
    };
    this.http.post(this.url+"cotizacion/listaCotizacionRepuestoByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaCotizacionRepuesto = datos;

          this.totalRepuesto = 0.00;
          for(let i=0; i<this.listaCotizacionRepuesto.length; i++){
            this.totalRepuesto = this.totalRepuesto + this.listaCotizacionRepuesto[i]["costo"]
          }
          this.totalCotizacion = parseFloat(this.totalDetalle) + parseFloat(this.totalRepuesto)

          this.listaProcesoImportacionByIdImportacion();
          this.tallerVehiculoByVehiculo();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaProcesoImportacionByIdImportacion(){
    Swal.fire({title: 'Buscando procesos de importacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id_importacion_vehiculo': this.id_importacion_vehiculo
    };
    this.http.post(this.url+"importacion/listaProcesoImportacionByIdImportacion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
    
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaProceso = datos;
          console.log(this.listaProceso)
          this.totalImportacion = 0.0
          if(this.listaProceso.length > 0){
            let elemento:any = document.querySelector("#tablaDetalle");
            elemento.style.display = 'block';
            elemento = document.querySelector("#tablaModelo");
            elemento.style.display = 'none';
            elemento = document.querySelector("#btnActualizarProceso");
            elemento.style.display = 'none';

            for(let i=0;i<=this.listaProceso.length-1;i++){
              this.totalImportacion = parseFloat(this.totalImportacion) + parseFloat(this.listaProceso[i]["subtotal"]);
            }
          }else{
            let elemento:any = document.querySelector("#btnAgregarProceso");
            elemento.style.display = 'block';
          }
          
          this.listaTallerVehiculoRepuestoByVehiculo();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaPagoProcesoImportacionByIdProcesoEstado(){
    Swal.fire({title: 'Buscando procesos de importacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id_importacion_proceso': this.id_proceso_importacion,
      "estado": 1
    };

    this.http.post(this.url+"importacion/listaPagoProcesoImportacionByIdProcesoEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaPagos = datos;

          this.listaTallerVehiculoRepuestoByVehiculo();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaTallerVehiculoRepuestoByVehiculo(){
    Swal.fire({title: 'Buscando Reparaciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo
    };

    this.http.post(this.url+"taller/listaTallerVehiculoRepuestoByVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaGastos = datos;
          this.totalGasto = 0.00;
          for(let i=0;i<this.listaGastos.length;i++){
            this.totalGasto = parseFloat(this.totalGasto) + parseFloat(this.listaGastos[i]["costo"])
          }

          this.total = this.totalGasto + this.totalImportacion;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaTalleresByEstado(){
    Swal.fire({title: 'Buscando Taller',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1"
    };

    this.http.post(this.url+"taller/listaTalleresByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          this.listaTaller = datos;

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  tallerVehiculoByVehiculo(){
    Swal.fire({title: 'Buscando Taller',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo
    };

    this.http.post(this.url+"taller/tallerVehiculoByVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          let elemento:any = document.querySelector("#divAsignarTaller");
          elemento.style.display = 'none';
          elemento = document.querySelector("#divTaller");
          elemento.style.display = 'none';

          if(datos.length > 0){
            this.id_taller_vehiculo = datos[0]["id_taller_vehiculo"]
            this.lblTallerAsignado = datos[0]["nombre_taller"]
            elemento = document.querySelector("#divTaller");
            elemento.style.display = 'block';
          }else{
            this.lblTallerAsignado = ""
            elemento = document.querySelector("#divAsignarTaller");
            elemento.style.display = 'block';
          }

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  reporteReciboPagoById(id_recibo:any){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_recibo_pago": id_recibo,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"recibo/reporteReciboPagoById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
      var blob = new Blob([datos_recibidos], { type: "application/pdf" });
      var url = window.URL.createObjectURL(blob);
      var pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert('Please disable your Pop-up blocker and try again.');
      }
      /*const fileName = 'reporte_comora.pdf';
      FileSaver.saveAs(blob, fileName);*/
      Swal.close();
    });
  }

  reporteDetalleImportacionById(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    //id_importacion, id_sucursal, id_usuario_impresion
    const params = new HttpParams({
      fromObject: {
      "id_importacion": this.id_importacion_vehiculo,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
    });

    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"importacion/reporteDetalleImportacionById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
      var blob = new Blob([datos_recibidos], { type: "application/pdf" });
      var url = window.URL.createObjectURL(blob);
      var pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert('Please disable your Pop-up blocker and try again.');
      }
      //const fileName = 'reporte_comora.pdf';
      //FileSaver.saveAs(blob, fileName);
      Swal.close();
    });
  }
}
