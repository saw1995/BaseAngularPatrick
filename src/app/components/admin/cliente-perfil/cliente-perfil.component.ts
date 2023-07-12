import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cliente-perfil',
  templateUrl: './cliente-perfil.component.html',
  styleUrls: ['./cliente-perfil.component.css']
})
export class ClientePerfilComponent implements OnInit {
  @ViewChild('cerrarModalAnho') cerrarModalAnho:any = ElementRef;
  @ViewChild('cerrarModalClase') cerrarModalClase:any = ElementRef;
  @ViewChild('cerrarModalCilindrada') cerrarModalCilindrada:any = ElementRef;
  @ViewChild('cerrarModalColor') cerrarModalColor:any = ElementRef;
  @ViewChild('cerrarModalMarca') cerrarModalMarca:any = ElementRef;
  @ViewChild('cerrarModalObservacion') cerrarModalObservacion:any = ElementRef;
  @ViewChild('cerrarModalTraccion') cerrarModalTraccion:any = ElementRef;
  @ViewChild('cerrarModalBusqueda') cerrarModalBusqueda:any = ElementRef;
  @ViewChild('cerrarModalContratoNuevo') cerrarModalContratoNuevo:any = ElementRef;
  @ViewChild('cerrarModalContratoDetalle') cerrarModalContratoDetalle:any = ElementRef;
  @ViewChild('cerrarModalAdendaNuevo') cerrarModalAdendaNuevo:any = ElementRef;
  @ViewChild('cerrarModalAdendaDetalle') cerrarModalAdendaDetalle:any = ElementRef;
  @ViewChild('cerrarModalReciboNuevo') cerrarModalReciboNuevo:any = ElementRef;
  @ViewChild('cerrarModalReciboDetalle') cerrarModalReciboDetalle:any = ElementRef;
  @ViewChild('cerrarModalDevolucionNuevo') cerrarModalDevolucionNuevo:any = ElementRef;
  @ViewChild('cerrarModalDevolucionDetalle') cerrarModalDevolucionDetalle:any = ElementRef;
  @ViewChild('cerrarModalImagen') cerrarModalImagen:any = ElementRef;
  @ViewChild('cerrarModalClienteDocumento') cerrarModalClienteDocumento:any = ElementRef;

  url:string = globals.url;

  id_cliente:any =this.router.snapshot.paramMap.get("id_cliente");
  txtTituloDocumento:any = "";

  id_sucursal:any = '';
  ci:string  = '';
  expedicion:string = '';
  genero:string = '';
  profesion:string = '';
  nombre:string = '';
  apellido_paterno:string = '';
  apellido_materno:string = '';
  correo:string = '';
  telefono:string = '';
  departamento:string = '';
  direccion:string = '';
  foto:string = 'sin_imagen_cliente.jpg';
  usuario:string = '';
  cliente_usuario:string = '';
  fecha:string = '';
  hora:string = '';
  interes:string = '';
  interes_literal:string = '';
  
  anho:any = '';
  clase:any = '';
  color:any = '';
  marca:any = '';
  cilindrada:any = '';
  observacion:any = '';
  traccion:any = '';

  id_vehiculo:any = '';
  id_clase_vehiculo:any = '';
  id_marca:any = '';
  id_color:any = '';
  id_traccion:any = '';

  showModalInteresAnho:boolean = false;
  showModalInteresClase:boolean = false;
  showModalInteresCilindrada:boolean = false;
  showModalInteresColor:boolean = false;
  showModalInteresMarca:boolean = false;
  showModalInteresObservacion:boolean = false;
  showModalInteresTraccion:boolean = false;
  showModalBusqueda:boolean = false;
  showModalContratoNuevo:boolean = false;
  showModalContratoDetalle:boolean = false;
  showModalAdendaNuevo:boolean = false;
  showModalAdendaDetalle:boolean = false;
  showModalReciboNuevo:boolean = false;
  showModalReciboDetalle:boolean = false;
  showModalDevolucionNuevo:boolean = false;
  showModalDevolucionDetalle:boolean = false;
  showModalClienteDocumento:boolean = false;

  listaAnhoInteres:any;
  listaClaseInteres:any;
  listaCilindradaInteres:any;
  listaColorInteres:any;
  listaMarcaInteres:any;
  listaObservacionInteres:any;
  listaTraccionInteres:any;

  listaClase:any;
  listaColor:any;
  listaMarca:any;
  listaTraccion:any;
  listaVehiculos:any;
  listaImportacion:any;
  listaDocumentos:any;

  id_clase_vehiculo_busqueda:any = '';
  id_marca_busqueda:any = '';
  lote:any = '';
  fecha_subasta:any = '';
  hora_subasta:any = '';
  plataforma:any = '';
  enlace:any = '';

  id_contrato:any = '';
  nroContrato:any = '';
  monto_garantia:any = '';
  monto_contrato:any = '';
  fecha_contrato:any = '';
  hora_contrato:any = '';
  usuario_contrato:any = '';

  id_adenda:any = '';
  nroAdenda:any = '';
  monto_adenda:any = '';
  fecha_adenda:any = '';
  hora_adenda:any = '';
  usuario_adenda:any = '';

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

  id_devolucion:any = '';
  nro_devolucion:any = '';
  devolucion_verificado:any = '';
  total_devolucion:any = '';
  detalle_devolucion:any = '';
  tipo_devolucion:any = '';
  tipo_pago_devolucion:any = '';
  observacion_devolucion:any = '';
  usuario_verificado_devolucion:any = '';
  fecha_verificado_devolucion:any = '';
  hora_verificado_devolucion:any = '';
  usuario_devolucion:any = '';
  fecha_devolucion:any = '';
  hora_devolucion:any = '';

  showModalImagen:Boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  listaImagenes: File[] = [];
  listaPrevia:any = [];
  variasImagenes:boolean = false;
  contadorImagen:any = 0;

  imageURL:string = "";
  viewerOpen:boolean = false;
  constructor(private router: ActivatedRoute, private http:HttpClient, private nav:Router, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Clientes") != undefined){
      this.url = globals.url;

      this.clienteById();
    }else{
      this.nav.navigate(['/restriccion']);
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
    this.listaImagenes = []
    this.listaPrevia = []

    this.showModalImagen = true;
  }

  ver_imagenDocumento(documento:any){

  }

  click_verImagen(rutaImagen:string){
    this.viewerOpen = true;
    this.imageURL = this.url + rutaImagen;
  }

  click_listaInteres(){
    this.listaAnhoInteresByCliente();
    this.listaClaseInteresByCliente();
    this.listaCilindradaInteresByCliente();
    this.listaColorInteresByCliente();
    this.listaMarcaInteresByCliente();
    this.listaObservacionInteresByCliente();
    this.listaTraccionInteresByCliente();
  }

  click_agregarClienteDocumento(){
    this.showModalClienteDocumento = true;
  }

  click_agregarBusqueda(){
    this.nav.navigate(['/vehiculo/agregar', "3", this.id_cliente]);
    /*this.showModalBusqueda = true;
    this.listaClaseVehiculoByEstado();
    this.listaMarcaByEstado();*/
  }

  click_agregarInteresAnho(){
    this.showModalInteresAnho = true;
  }

  click_agregarInteresClase(){
    this.showModalInteresClase = true;
    this.listaClaseVehiculoByEstado();
  }

  click_agregarInteresCilindrada(){
    this.showModalInteresCilindrada = true;
  }

  click_agregarInteresColor(){
    this.showModalInteresColor = true;
    this.listaColorByEstado();
  }

  click_agregarInteresMarca(){
    this.showModalInteresMarca = true;
    this.listaMarcaByEstado();
  }

  click_agregarInteresObservacion(){
    this.showModalInteresObservacion = true;
  }

  click_agregarInteresTraccion(){
    this.showModalInteresTraccion = true;
    this.listaTraccionByEstado();
  }

  click_generarContrato(){
    this.showModalContratoNuevo = true;
  }

  click_abrirContratoDetalle(){
    this.showModalContratoDetalle = true;
  }

  click_abrirEditarContrato(){
    this.nav.navigate(['/contrato/editar', encryptNumber(this.id_contrato)]);
  }

  click_generarAdenda(){
    this.showModalAdendaNuevo = true;
    this.listaBusquedaVehiculoByCliente();
  }

  click_abrirAdendaDetalle(){
    this.showModalAdendaDetalle = true;
  }

  click_abrirEditarAdenda(){
    this.nav.navigate(['/adenda/editar', encryptNumber(this.id_adenda)]);
  }

  click_generarRecibo(){
    this.showModalReciboNuevo = true;
  }

  click_abrirReciboDetalle(){
    this.showModalReciboDetalle = true;
  }

  click_generarDevolucion(){
    this.showModalDevolucionNuevo = true;
  }

  click_irClienteEditar(){
    this.nav.navigate(['/cliente/editar', this.id_cliente]);
  }

  click_cotizacionDetalle(id_cotizacion:any){
    this.nav.navigate(['/cotizacion/detalle', id_cotizacion]);
  }

  click_abrirDevolucionDetalle(){
    this.showModalDevolucionDetalle = true;
  }

  click_nevagarImportacionDetalle(id_vehiculo:string){
    this.nav.navigate(['/importacion/detalle/', encryptNumber(id_vehiculo)]);
  }

  click_whatsapp(celular:any){
    window.open("https://api.whatsapp.com/send?phone=591" + celular, "_blank");
  }

  agregarClienteBusqueda(){
    if(this.id_marca_busqueda == "")
    {
      Swal.fire("Campo Vacio", "El campo marca se encuentra vacio.", "warning");
    } else if (this.id_clase_vehiculo_busqueda == "")
    {
      Swal.fire("Campo Vacio", "El campo clase de vehiculo se encuentra vacio.", "warning");
    }
    else if (this.lote == "")
    {
      Swal.fire("Campo Vacio", "El campo lote se encuentra vacio.", "warning");
    }
    else if (this.fecha_subasta == "")
    {
      Swal.fire("Campo Vacio", "El campo fecha de subasta se encuentra vacio.", "warning");
    }
    else if (this.hora_subasta == "")
    {
      Swal.fire("Campo Vacio", "El campo hora de subasta se encuentra vacio.", "warning");
    }
    else if (this.plataforma == "")
    {
      Swal.fire("Campo Vacio", "El campo plataforma se encuentra vacio.", "warning");
    }
    else if (this.enlace == "")
    {
      Swal.fire("Campo Vacio", "El campo enlace se encuentra vacio.", "warning");
    }
    else
    {
      let parametros = {
        'id_cliente': this.id_cliente,
        'nivel_interes': "0",
        'id_marca': this.id_marca_busqueda,
        'id_clase': this.id_clase_vehiculo_busqueda,
        'estado': "1",
        'lote': this.lote,
        'link': this.enlace,
        'plataforma': this.plataforma,
        'fecha_subasta': this.fecha_subasta,
        'hora_subasta': this.hora_subasta,
        'foto': 'sin_imagen_vehiculo.jpg',
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
  
      Swal.fire({title: 'Agregando Vehiculo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "cliente/agregarClienteBusqueda", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.id_marca_busqueda = '';
              this.id_clase_vehiculo_busqueda = '';
              this.lote = '';
              this.plataforma = '';
              this.enlace = '';
              this.fecha_subasta = '';
              this.hora_subasta = '';
              this.cerrarModalBusqueda.nativeElement.click();
              this.showModalBusqueda = false;
              this.listaBusquedaVehiculoByCliente();
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

  agregarClaseVehiculo(){
    if(this.clase == "")
    {
      Swal.fire("Campo Vacio", "El campo nombre de la clase se encuentra vacio.", "warning");
    }
    else
    {
      let parametros = {
        'nombre': this.clase,
        'descripcion': "",
        'foto': 'sin_imagen_clase.jpg',
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
  
      Swal.fire({title: 'Agregando Clase',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "clase/agregarClaseVehiculo", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaClaseVehiculoByEstado();
              this.id_clase_vehiculo = datos.id_clase_vehiculo;
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

  agregarMarca(){
    if(this.marca == "")
    {
      Swal.fire("Campo Vacio", "El campo nombre de la marca se encuentra vacio.", "warning");
    }
    else
    {
      let parametros = {
        'nombre': this.marca,
        'descripcion': "",
        'foto': 'sin_imagen_marca.jpg',
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
  
      Swal.fire({title: 'Agregando Marca',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "marca/agregarMarca", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaMarcaByEstado();
              this.id_marca = datos.id_marca;
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

  agregarColor(){
    if(this.color == "")
    {
      Swal.fire("Campo Vacio", "El campo nombre del color se encuentra vacio.", "warning");
    }
    else
    {
      let parametros = {
        'nombre': this.color,
      };
  
      Swal.fire({title: 'Agregando Color',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "clase/agregarColor", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaColorByEstado();
              this.id_color = datos.id_color;
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

  agregarTraccion(){
    if(this.traccion == "")
    {
      Swal.fire("Campo Vacio", "El campo nombre de la traccion se encuentra vacio.", "warning");
    }
    else
    {
      let parametros = {
        'nombre': this.traccion,
      };
  
      Swal.fire({title: 'Agregando Traccion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "clase/agregartraccion", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.listaTraccionByEstado();
              this.id_traccion = datos.id_traccion;
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

  agregarInteresAnho(){
    Swal.fire({title: 'Agregando Año',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.anho == "")
    {
      Swal.fire("Campo Vacio", "Introduza el anho, intente nuevamente", "warning");
    }
    else
    {
      let parametros = {
        "id_cliente": this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"), 
        'anho': this.anho,
        'estado': "1",
      };
  
      this.http.post(this.url + "interes/agregarInteresAnho", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.anho = '';
              this.cerrarModalAnho.nativeElement.click();
              this.showModalInteresAnho = false;
              this.listaAnhoInteresByCliente();
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

  agregarInteresClase(){
    Swal.fire({title: 'Agregando Clase de Vehiculo',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.id_clase_vehiculo == "")
    {
      Swal.fire("Campo Vacio", "Introduza la clase de Vehiculo, intente nuevamente", "warning");
    }
    else
    {
      let parametros = {
        "id_cliente": this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"), 
        'id_clase_vehiculo': this.id_clase_vehiculo,
        'estado': "1",
      };
  
      this.http.post(this.url + "interes/agregarInteresClase", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.id_clase_vehiculo = '';
              this.cerrarModalClase.nativeElement.click();
              this.showModalInteresClase = false;
              this.listaClaseInteresByCliente();
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

  agregarInteresCilindrada(){
    Swal.fire({title: 'Agregando Cilindrada',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.cilindrada == "")
    {
      Swal.fire("Campo Vacio", "Introduza la cilindrada, intente nuevamente", "warning");
    }
    else
    {
      let parametros = {
        "id_cliente": this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"), 
        'cilindrada': this.cilindrada,
        'estado': "1",
      };
  
      this.http.post(this.url + "interes/agregarInteresCilindrada", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.cilindrada = '';
              this.cerrarModalCilindrada.nativeElement.click();
              this.showModalInteresCilindrada = false;
              this.listaCilindradaInteresByCliente();
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

  agregarInteresColor(){
    Swal.fire({title: 'Agregando Color',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.id_color == "")
    {
      Swal.fire("Campo Vacio", "Introduza el Color, intente nuevamente", "warning");
    }
    else
    {
      let parametros = {
        "id_cliente": this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"), 
        'id_color': this.id_color,
        'estado': "1",
      };
  
      this.http.post(this.url + "interes/agregarInteresColor", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.id_color = '';
              this.cerrarModalColor.nativeElement.click();
              this.showModalInteresColor = false;
              this.listaColorInteresByCliente();
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

  agregarInteresMarca(){
    Swal.fire({title: 'Agregando Marca',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.id_marca == "")
    {
      Swal.fire("Campo Vacio", "Introduza la marca intente nuevamente", "warning");
    }
    else
    {
      let parametros = {
        "id_cliente": this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"), 
        'id_marca': this.id_marca,
        'estado': "1",
      };
  
      this.http.post(this.url + "interes/agregarInteresMarca", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.id_marca = '';
              this.cerrarModalMarca.nativeElement.click();
              this.showModalInteresMarca = false;
              this.listaMarcaInteresByCliente();
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

  agregarInteresObservacion(){
    Swal.fire({title: 'Agregando Detalle',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.observacion == "")
    {
      Swal.fire("Campo Vacio", "Introduza el Detalle, intente nuevamente", "warning");
    }
    else
    {
      let parametros = {
        "id_cliente": this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"), 
        'observacion': this.observacion,
        'estado': "1",
      };
  
      this.http.post(this.url + "interes/agregarInteresObservacion", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.observacion = '';
              this.cerrarModalObservacion.nativeElement.click();
              this.showModalInteresObservacion = false;
              this.listaObservacionInteresByCliente();
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

  agregarInteresTraccion(){
    Swal.fire({title: 'Agregando Traccion',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.id_traccion == "")
    {
      Swal.fire("Campo Vacio", "Introduza la traccion e intente nuevamente", "warning");
    }
    else
    {
      let parametros = {
        "id_cliente": this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"), 
        'id_traccion': this.id_traccion,
        'estado': "1",
      };
  
      this.http.post(this.url + "interes/agregarInteresTraccion", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.id_traccion = '';
              this.cerrarModalTraccion.nativeElement.click();
              this.showModalInteresTraccion = false;
              this.listaTraccionInteresByCliente();
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

  agregarContrato(){
    if(this.monto_garantia == "")
    {
      Swal.fire("Campo Vacio", "Introduza el monto de garantia", "warning");
    }
    else
    {
      let parametros = {
        'id_cliente': this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"),
        'foto': "",
        'monto': this.monto_garantia,
        'estado': "1"
      };
  
      Swal.fire({title: 'Generando Contrato',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
      this.http.post(this.url + "contrato/agregarContrato", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.monto_garantia = ''
              this.cerrarModalContratoNuevo.nativeElement.click();
              this.showModalContratoNuevo = false;
              this.listaContratoByCliente();
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

  agregarAdenda(){
    if(this.monto_adenda == "")
    {
      Swal.fire("Campo Vacio", "Introduza el monto de la adenda", "warning");
    }
    else
    {
      let parametros = {
        'importacion_local': "1",
        'id_sucursal': localStorage.getItem("sucursal"),
        'id_cliente': this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"),
        'id_vehiculo': this.id_vehiculo,
        'foto': "",
        'monto': this.monto_adenda,
        'estado': "1"
      };
  
      Swal.fire({title: 'Generando Adenda',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
      this.http.post(this.url + "adenda/agregarAdenda", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.monto_adenda = ''
              this.cerrarModalAdendaNuevo.nativeElement.click();
              this.showModalAdendaNuevo = false;
              this.listaAdendaByCliente();
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
        'tipo': "Deposito de Garantia",
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
              if(this.listaImagenes.length > 0)
              {
                this.actualizarRespaldoReciboById(datos.id_recibo_pago);
              }else{
                this.total_recibo = ''
                this.cerrarModalReciboNuevo.nativeElement.click();
                this.showModalReciboNuevo = false;
                this.listaReciboPagoByClienteTipo();
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
      this.listaReciboPagoByClienteTipo();
    });
  }

  agregarClienteDocumento(){
    if(this.txtTituloDocumento == "")
    {
      Swal.fire("Campo Vacio", "Introduza el titulo de referencia del documento", "warning");
    }else{
      Swal.fire({title: 'Subiendo Imagen',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      const formData: FormData = new FormData();
      formData.append('imagen', this.listaImagenes[0]);
      this.http.post(
      this.url + "cliente/agregarClienteDocumento/" + this.id_cliente + "/" + this.txtTituloDocumento + "/" + localStorage.getItem("id_usuario"),
      formData).subscribe((response:any) => {
        Swal.close();

        this.cerrarModalClienteDocumento.nativeElement.click();
        this.showModalClienteDocumento = false;
        this.listaDocumentosClientesByCliente();
      });
    }
    
  }

  agregarDevolucionPago(){
    if(this.total_devolucion == "")
    {
      Swal.fire("Campo Vacio", "Introduza el total de la devolucion de pago", "warning");
    }else if(this.tipo_pago_devolucion == "")
    {
      Swal.fire("Campo Vacio", "Seleccione el tipo de Pago", "warning");
    }
    else
    {
      let parametros = {
        'id_cliente': this.id_cliente,
        'id_usuario': localStorage.getItem("id_usuario"),
        'tipo': "Deposito de Garantia",
        'detalle': this.detalle_devolucion,
        'tipo_pago': this.tipo_pago_devolucion,
        'observacion': this.observacion_devolucion,
        'total': this.total_devolucion,
        'respaldo': "",
        'estado': "1",
        'id_sucursal': this.id_sucursal
      };
  
      Swal.fire({title: 'Generando Devolucion de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
      this.http.post(this.url + "devolucionpago/agregarDevolucionPago", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.total_devolucion = ''
              this.cerrarModalDevolucionNuevo.nativeElement.click();
              this.showModalDevolucionNuevo = false;
              this.listaDevolucionPagoByClienteTipo();
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

  agregarCotizacion(id_vehiculo:any){
    Swal.fire({
      title: '¿Esta seguro de generar la Cotización?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Generar'
    }).then((result) => {
      if (result.isConfirmed) {
        let parametros = {
          'id_vehiculo': id_vehiculo,
          'id_usuario': localStorage.getItem("id_usuario"),
          'estado': "1"
        };
    
        Swal.fire({title: 'Generando Cotización',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
        this.http.post(this.url + "cotizacion/agregarCotizacion", parametros).subscribe((datos_recibidos:any) => 
        {
          Swal.close();
    
          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              if(datos.affectedRows == 1)
              {
                this.nav.navigate(['/cotizacion/detalle', datos.id_cotizacion]);
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


  actualizarEstadoAnho(id:any){
    Swal.fire({title: 'Eliminando Año',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id': id, 
      'estado': "0",
    };

    this.http.post(this.url + "interes/actualizarEstadoAnho", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.affectedRows == 1)
          {
            this.listaAnhoInteresByCliente();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarEstadoClase(id:any){
    Swal.fire({title: 'Eliminando Clase de Vehiculo',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id': id, 
      'estado': "0",
    };

    this.http.post(this.url + "interes/actualizarEstadoClase", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.affectedRows == 1)
          {
            this.listaClaseInteresByCliente();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarEstadoCilindrada(id:any){
    Swal.fire({title: 'Eliminando Cilindrada',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id': id, 
      'estado': "0",
    };

    this.http.post(this.url + "interes/actualizarEstadoCilindrada", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.affectedRows == 1)
          {
            this.listaCilindradaInteresByCliente();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarEstadoColor(id:any){
    Swal.fire({title: 'Eliminando Color',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id': id, 
      'estado': "0",
    };

    this.http.post(this.url + "interes/actualizarEstadoColor", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.affectedRows == 1)
          {
            this.listaColorInteresByCliente();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarEstadoMarca(id:any){
    Swal.fire({title: 'Eliminando Marca',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id': id, 
      'estado': "0",
    };

    this.http.post(this.url + "interes/actualizarEstadoMarca", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.affectedRows == 1)
          {
            this.listaMarcaInteresByCliente();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarEstadoObservacion(id:any){
    Swal.fire({title: 'Eliminando Detalle',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id': id, 
      'estado': "0",
    };

    this.http.post(this.url + "interes/actualizarEstadoObservacion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.affectedRows == 1)
          {
            this.listaObservacionInteresByCliente();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarEstadoTraccion(id:any){
    Swal.fire({title: 'Eliminando Traccion',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id': id, 
      'estado': "0",
    };

    this.http.post(this.url + "interes/actualizarEstadoTraccion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];

      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.affectedRows == 1)
          {
            this.listaTraccionInteresByCliente();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  clienteById(){

    Swal.fire({title: 'Buscando cliente',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"cliente/clienteById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          this.id_sucursal = datos[0].id_sucursal;
          this.ci = datos[0].ci;
          this.expedicion = datos[0].ci_exp;
          this.nombre = datos[0].nombre;
          this.apellido_paterno = datos[0].appat;
          this.apellido_materno = datos[0].apmat;
          this.genero = datos[0].genero;
          this.profesion = datos[0].nombre_profesion;
          this.correo = datos[0].email;
          this.telefono = datos[0].celular;
          this.departamento = datos[0].departamento;
          this.direccion = datos[0].direccion;
          this.foto = datos[0].foto;
          this.cliente_usuario = datos[0].cliente_usuario;
          this.usuario = datos[0].usuario;
          this.fecha = datos[0].fecha;
          this.hora = datos[0].hora;
          this.interes = datos[0].interes;
          this.interes_literal = datos[0].interes_letra + " - " + datos[0].interes_literal;

          let elemento:any = document.querySelector("#divClienteCiNoValido");
            elemento.style.display = 'block';
            elemento = document.querySelector("#divClienteCiValido");
            elemento.style.display = 'none';
          if(this.ci != "0" && this.direccion != ""){
            let elemento:any = document.querySelector("#divClienteCiNoValido");
            elemento.style.display = 'none';
            elemento = document.querySelector("#divClienteCiValido");
            elemento.style.display = 'flex';
          }
        
          this.listaContratoByCliente();
          this.listaDocumentosClientesByCliente();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaDocumentosClientesByCliente(){

    Swal.fire({title: 'Buscando Documentos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"cliente/listaDocumentosClientesByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          if(datos.length > 0){
            this.listaDocumentos = datos
          }

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaContratoByCliente(){

    Swal.fire({title: 'Buscando Contrato',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"contrato/listaContratoByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          let elemento:any = document.querySelector("#btnContratoGenerar");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnContratoImprimir");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnContratoDetalle");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnContratoEditar");
          elemento.style.display = 'none';

          if(datos.length > 0){
            this.id_contrato = datos[0]["id"];
            this.nroContrato = datos[0]["nro_contrato"];
            this.monto_contrato = datos[0]["monto"];
            this.fecha_contrato = datos[0]["fecha"];
            this.hora_contrato = datos[0]["hora"];
            this.usuario_contrato = datos[0]["usuario"];
            

            elemento = document.querySelector("#btnContratoImprimir");
            elemento.style.display = 'block';
            elemento = document.querySelector("#btnContratoDetalle");
            elemento.style.display = 'block';
            elemento = document.querySelector("#btnContratoEditar");
            elemento.style.display = 'block';
          }else{
            this.nroContrato = "Sin Contrato";
            let elemento:any = document.querySelector("#btnContratoGenerar");
            elemento.style.display = 'block';
          }

          this.listaAdendaByCliente();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaAdendaByCliente(){

    Swal.fire({title: 'Buscando Adenda',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"adenda/listaAdendaByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          let elemento:any = document.querySelector("#btnAdendaGenerar");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnAdendaImprimir");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnAdendaDetalle");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnAdendaEditar");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnVehiculoImportado");
          elemento.style.display = 'none';

          if(datos.length > 0){
            this.id_adenda = datos[0]["id"];
            this.nroAdenda = datos[0]["nro_adenda"];
            this.monto_adenda = datos[0]["monto"];
            this.fecha_adenda = datos[0]["fecha"];
            this.hora_adenda = datos[0]["hora"];
            this.usuario_adenda = datos[0]["usuario"];
            

            elemento = document.querySelector("#btnAdendaImprimir");
            elemento.style.display = 'block';
            elemento = document.querySelector("#btnAdendaDetalle");
            elemento.style.display = 'block';
            elemento = document.querySelector("#btnAdendaEditar");
            elemento.style.display = 'block';
            elemento = document.querySelector("#btnVehiculoImportado");
            elemento.style.display = 'block';
          }else{
            this.nroAdenda = "Sin Adenda";
            let elemento:any = document.querySelector("#btnAdendaGenerar");
            elemento.style.display = 'block';
          }

          this.listaReciboPagoByClienteTipo();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaReciboPagoByClienteTipo(){

    Swal.fire({title: 'Buscando Recibo de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "tipo": "Deposito de Garantia",
      "estado": "1"
    };
    this.http.post(this.url+"recibo/listaReciboPagoByClienteTipo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          let elemento:any = document.querySelector("#btnReciboGenerar");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnReciboImprimir");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnReciboDetalle");
          elemento.style.display = 'none';
          this.total_recibo = '';

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
            
            elemento = document.querySelector("#btnReciboImprimir");
            elemento.style.display = 'block';
            elemento = document.querySelector("#btnReciboDetalle");
            elemento.style.display = 'block';
          }else{
            this.nro_recibo = "Aun no se realizo el pago";
            this.recibo_verificado = "SIN VERIFICAR";
            this.total_recibo = this.monto_contrato;
            elemento = document.querySelector("#btnReciboGenerar");
            elemento.style.display = 'block';
          }

          this.listaDevolucionPagoByClienteTipo();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaDevolucionPagoByClienteTipo(){

    Swal.fire({title: 'Buscando Devolucion de Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "tipo": "Deposito de Garantia",
      "estado": "1"
    };
    this.http.post(this.url+"devolucionpago/listaDevolucionPagoByClienteTipo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          let elemento:any = document.querySelector("#btnDevolucionGenerar");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnDevolucionImprimir");
          elemento.style.display = 'none';
          elemento = document.querySelector("#btnDevolucionDetalle");
          elemento.style.display = 'none';
          this.total_devolucion = '';

          if(datos.length > 0){
            this.id_devolucion = datos[0]["id"];
            this.nro_devolucion = datos[0]["nro_devolucion_pago"];
            this.fecha_devolucion = datos[0]["fecha"];
            this.hora_devolucion = datos[0]["hora"];
            this.usuario_devolucion = datos[0]["usuario"];
            this.total_devolucion = datos[0]["total"];
            this.detalle_devolucion = datos[0]["detalle"];
            this.observacion_devolucion = datos[0]["observacion"];
            this.tipo_pago_devolucion = datos[0]["tipo_pago"];
            this.tipo_devolucion = datos[0]["tipo"];
            this.fecha_verificado_devolucion = datos[0]["fecha_verificado"];
            this.hora_verificado_devolucion = datos[0]["hora_verificado"];
            this.usuario_verificado_devolucion = datos[0]["usuario_verificado"];

            if(datos[0]["id_usuario_verificado"] == '1'){
              this.fecha_verificado_devolucion = "- - -";
              this.hora_verificado_devolucion = "- - -";
              this.usuario_verificado_devolucion = "- - -";
            }

            this.devolucion_verificado = "SIN VERIFICAR";
            if(datos[0]["verificado"] == '1'){
              this.devolucion_verificado = "VERIFICADO";
            }
            
            elemento = document.querySelector("#btnDevolucionImprimir");
            elemento.style.display = 'block';
            elemento = document.querySelector("#btnDevolucionDetalle");
            elemento.style.display = 'block';
          }else{
            this.nro_devolucion = "Aun no se realizo la Devolucion";
            this.devolucion_verificado = "SIN VERIFICAR";
            this.total_devolucion = this.monto_contrato;
            elemento = document.querySelector("#btnDevolucionGenerar");
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

  listaBusquedaVehiculoByCliente()
  {
    Swal.fire({title: 'Buscando Vehiculos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1,
      "id_cliente": this.id_cliente
    };
    this.http.post(this.url+"cliente/listaBusquedaVehiculoByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaVehiculos = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaClaseVehiculoByEstado()
  {
    Swal.fire({title: 'Buscando clases',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1
    };
    this.http.post(this.url+"clase/listaClaseVehiculoByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaClase = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaMarcaByEstado()
  {
    Swal.fire({title: 'Buscando marca',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1
    };
    this.http.post(this.url+"marca/listaMarcaByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaMarca = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaColorByEstado()
  {
    Swal.fire({title: 'Buscando color',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1
    };
    this.http.post(this.url+"clase/listaColorByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaColor = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaTraccionByEstado()
  {
    Swal.fire({title: 'Buscando Traccion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1
    };
    this.http.post(this.url+"clase/listaTraccionByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaTraccion = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaAnhoInteresByCliente(){
    Swal.fire({title: 'Buscando Interes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"interes/listaAnhoInteresByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.listaAnhoInteres = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaClaseInteresByCliente(){
    Swal.fire({title: 'Buscando Interes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"interes/listaClaseInteresByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.listaClaseInteres = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaCilindradaInteresByCliente(){
    Swal.fire({title: 'Buscando Interes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"interes/listaCilindradaInteresByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.listaCilindradaInteres = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaColorInteresByCliente(){
    Swal.fire({title: 'Buscando Interes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"interes/listaColorInteresByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.listaColorInteres = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaMarcaInteresByCliente(){
    Swal.fire({title: 'Buscando Interes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"interes/listaMarcaInteresByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.listaMarcaInteres = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaObservacionInteresByCliente(){
    Swal.fire({title: 'Buscando Interes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"interes/listaObservacionInteresByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.listaObservacionInteres = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaTraccionInteresByCliente(){
    Swal.fire({title: 'Buscando Interes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"interes/listaTraccionInteresByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.listaTraccionInteres = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaImportacionByCliente()
  {
    Swal.fire({title: 'Buscando registros de importacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_cliente": this.id_cliente,
      "estado": "1"
    };
    this.http.post(this.url+"importacion/listaImportacionByCliente", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaImportacion = datos;

          for(let i=0;i<this.listaImportacion.length;i++){
            let imagenes = this.listaImportacion[i].foto_vehiculo.split(",");
            this.listaImportacion[i].foto = imagenes;
            this.listaImportacion[i].foto_uno = imagenes[0];
          }
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });

  }

  reporteContratoById(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_contrato": this.id_contrato,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"contrato/reporteContratoById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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

  reporteAdendaById(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_adenda": this.id_adenda,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"adenda/reporteAdendaById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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

  reporteReciboPagoById(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_recibo_pago": this.id_recibo,
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

  reporteDevolucionPagoById(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_devolucion_pago": this.id_devolucion,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"devolucionpago/reporteDevolucionPagoById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
}
