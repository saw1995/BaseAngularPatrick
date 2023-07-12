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
  selector: 'app-taller-detalle',
  templateUrl: './taller-detalle.component.html',
  styleUrls: ['./taller-detalle.component.css']
})
export class TallerDetalleComponent implements OnInit {
  @ViewChild('cerrarModalReparacion') cerrarModalReparacion:any = ElementRef;
  @ViewChild('cerrarModalRepuesto') cerrarModalRepuesto:any = ElementRef;
  @ViewChild('cerrarModalSolicitarPago') cerrarModalSolicitarPago:any = ElementRef;
  @ViewChild('cerrarModalPago') cerrarModalPago:any = ElementRef;
  @ViewChild('cerrarModalPagoDetalle') cerrarModalPagoDetalle:any = ElementRef;
  @ViewChild('cerrarModalAvance') cerrarModalAvance:any = ElementRef;
  @ViewChild('cerrarModalImagen') cerrarModalImagen:any = ElementRef;

  url:string = globals.url;

  showModalReparacion:boolean = false;
  showModalRepuesto:boolean = false;
  showModalSolicitarPago:boolean = false;
  showModalPago:boolean = false;
  showModalPagoDetalle:boolean = false;
  showModalAvance:boolean = false;

  id_sucursal:any = "";
  id_taller_vehiculo:any = "";
  id_vehiculo:any = "";
  id_taller_vehiculo_avance:any = "";
  id_taller_vehiculo_pago:any = "";

  id_repuesto:string = '';
  nombre_repuesto:string = '';
  costo:string = '';
  detalle:string = '';
  totalRepuesto:any = 0.00;

  detalle_pago:any = "";
  detalle_solicitud:any = "";
  total:any = "";
  pago_tipo:any = "";

  detalle_avance:any = "";

  costo_pintura:any = 0.00;
  costo_chaperio:any = 0.00;
  costo_extra:any = 0.00;
  fecha_entrega:any = "";

  tallerVehiculo:any;
  pago:any;
  listaPago:any = [];
  listaAvance:any = [];
  listaRepuesto:any = [];
  listaDetalleRepuesto:any = [];

  showModalImagen:Boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  listaImagenes: File[] = [];
  listaPrevia:any = [];
  variasImagenes:boolean = false;
  contadorImagen:any = 0;

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Talleres") != undefined){
      this.url = globals.url;  
      this.id_sucursal = localStorage.getItem("sucursal")
      this.id_taller_vehiculo = this.route.snapshot.paramMap.get("id_taller_vehiculo");

      this.tallerVehiculoById();
      this.listaTallerVehiculoRepuestoByTalleVehiculo();
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

  click_soliciarPago(){
    this.listaImagenes = [];
    this.showModalSolicitarPago = true;
  }

  click_agregarAvance(){
    this.showModalAvance = true;
  }

  click_agregarPago(id:any){
    this.listaImagenes = [];
    this.showModalPago = true;
    this.id_taller_vehiculo_pago = id;
  }

  click_detallePago(id:any){
    this.showModalPagoDetalle = true;
    this.id_taller_vehiculo_pago = id;

    this.tallerVehiculoPagoById();
  }

  click_agregarCostos(){
    this.showModalReparacion = true;
  }

  click_agregarRepuesto(){
    this.id_repuesto = "";
    this.nombre_repuesto = "";
    this.costo = "";
    this.detalle = "";

    this.showModalRepuesto = true;

    this.listaRepuestoByVehiculo();
  }

  clicl_agregarRepuesto(){
    if(this.id_repuesto == ""){
      this.agregarRepuesto();
    }else{
      this.agregarTallerVehiculoRepuesto();
    }
  }

  change_repuesto(){
    for(let i=0; i<this.listaRepuesto.length; i++){
      if(this.listaRepuesto[i]["id_repuesto"] == this.id_repuesto){
        this.nombre_repuesto = this.listaRepuesto[i]["nombre"]
        this.costo = this.listaRepuesto[i]["precio"]
        this.detalle = this.listaRepuesto[i]["detalle"]
        break;
      }
    }
  }

  agregarRepuesto(){
    Swal.fire({
      title: '¿Esta seguro de agregar un nuevo repuesto?',
      html: "<b>Repuesto:</b>" + this.nombre_repuesto
          + "</br> <b>Costo:</b>" + this.costo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Repuesto',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'id_vehiculo': this.id_vehiculo,
          'nombre': this.nombre_repuesto,
          'detalle': this.detalle,
          'precio': this.costo,
          'id_usuario': localStorage.getItem("id_usuario"),
          'estado': "1",
        };
        this.http.post(this.url+"repuesto/agregarRepuesto", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.id_repuesto = datos["id_repuesto"]

              this.agregarTallerVehiculoRepuesto();
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
      
    });
  }

  agregarTallerVehiculoRepuesto(){
    Swal.fire({
      title: '¿Esta seguro de agregar el repuesto a la Solicitud?',
      html: "<b>Repuesto:</b>" + this.nombre_repuesto
          + "</br> <b>Costo:</b>" + this.costo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Repuesto',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'id_taller_vehiculo': this.id_taller_vehiculo,
          'id_repuesto': this.id_repuesto,
          'costo': this.costo,
          'id_usuario': localStorage.getItem("id_usuario")
        };
        this.http.post(this.url+"taller/agregarTallerVehiculoRepuesto", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaTallerVehiculoRepuestoByTalleVehiculo()

              this.cerrarModalRepuesto.nativeElement.click();
              this.showModalRepuesto = false;
            }else{
              Swal.fire("Error en el Servidor", datosNodejs, "warning");
            }
          }else{
            Swal.fire("Error en la Base de Datos", datosMysql, "warning");
          }
        });
      }
      
    });
  }

  agregarTallerVehiculoPago()
  {
    if(this.detalle_solicitud !== ""){
      if(this.total !== ""){
        if(this.pago_tipo !== ""){
          Swal.fire({
            title: '¿Esta seguro de solicitar un pago?',
            html: "<b>Solicitud: </b>" + this.detalle_solicitud,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Solicitar'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({title: 'Agregando Solicitud',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
              let parametros = {
                'id_taller_vehiculo': this.id_taller_vehiculo,
                'detalle_solicitud': this.detalle_solicitud,
                'pago_tipo': this.pago_tipo,
                'total': this.total,
                'id_usuario_solicitud': localStorage.getItem("id_usuario"),
                'verificado': "0",
              };
              this.http.post(this.url+"taller/agregarTallerVehiculoPago", parametros).subscribe((datos_recibidos:any) => {
                Swal.close();
      
                let datos = datos_recibidos["datos"];
                let datosMysql = datos_recibidos["mysql"];
                let datosNodejs = datos_recibidos["nodejs"];
                if(datosMysql === undefined){
                  if(datosNodejs === undefined){
                    this.listaTallerVehiculoPagoByTalleVehiculo();
      
                    this.cerrarModalSolicitarPago.nativeElement.click();
                    this.showModalSolicitarPago = false;
                  }else{
                    Swal.fire("Error en el Servidor", datosNodejs, "warning");
                  }
                }else{
                  Swal.fire("Error en la Base de Datos", datosMysql, "warning");
                }
              });
            }
            
          });
        }else{
          Swal.fire("Campo Vacio", "Ingrese el tipo de pago, intente nuevamente", "warning");
        }
      }else{
        Swal.fire("Campo Vacio", "Ingrese el monto de pago, intente nuevamente", "warning");
      }
    }else{
      Swal.fire("Campo Vacio", "Ingrese la solicitud de pago, intente nuevamente", "warning");
    }
  }

  agregarTallerVehiculoAvance()
  {
    if(this.detalle_avance !== ""){
      if(this.listaImagenes.length > 0){
        Swal.fire({
          title: '¿Esta seguro de agregar el avance?',
          html: "<b>Solicitud: </b>" + this.detalle_avance,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Agregar'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({title: 'Agregando Avance',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
            let parametros = {
              'id_taller_vehiculo': this.id_taller_vehiculo,
              'foto': "sin_imagen_avance.jpg",
              'detalle': this.detalle_avance,
              'id_usuario': localStorage.getItem("id_usuario")
            };
            this.http.post(this.url+"taller/agregarTallerVehiculoAvance", parametros).subscribe((datos_recibidos:any) => {
              Swal.close();
    
              let datos = datos_recibidos["datos"];
              let datosMysql = datos_recibidos["mysql"];
              let datosNodejs = datos_recibidos["nodejs"];
              if(datosMysql === undefined){
                if(datosNodejs === undefined){
                  this.id_taller_vehiculo_avance = datos.id_taller_vehiculo_avance;
                  this.cerrarModalAvance.nativeElement.click();
                  this.showModalAvance = false;

                  this.agregarImagenAvanceById();
                }else{
                  Swal.fire("Error en el Servidor", datosNodejs, "warning");
                }
              }else{
                Swal.fire("Error en la Base de Datos", datosMysql, "warning");
              }
            });
          }
          
        });
      }else{
        Swal.fire("Campo Vacio", "Seleccione una imagen del avance, intente nuevamente", "warning");
      }
    }else{
      Swal.fire("Campo Vacio", "Ingrese el detalle del avance, intente nuevamente", "warning");
    }
  }

  actualizarCostosTallerVehiculoById()
  {
    if(this.costo_pintura !== ""){
      if(this.costo_chaperio !== ""){
        if(this.costo_extra !== ""){
          if(this.fecha_entrega !== ""){
            Swal.fire({
              title: '¿Esta seguro de agregar los Costos?',
              html: " <b>Precio de Pintura: </b> $us. " + this.costo_pintura
                    + "<br><b>Precio de Chaperio: </b> $us. " + this.costo_chaperio
                    + "<br><b>Precio Extra: </b> $us. " + this.costo_extra
                    + "<br><b>Fecha de Entrega: </b>" + this.fecha_entrega,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Agregar'
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({title: 'Agregando Costos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
                let parametros = {
                  'id_taller_vehiculo': this.id_taller_vehiculo,
                  'precio_pintura': this.costo_pintura,
                  'precio_chaperio': this.costo_chaperio,
                  'precio_extra': this.costo_extra,
                  'fecha_entrega': this.fecha_entrega,
                  'id_usuario': localStorage.getItem("id_usuario")
                };
                console.log(parametros)
                this.http.post(this.url+"taller/actualizarCostosTallerVehiculoById", parametros).subscribe((datos_recibidos:any) => {
                  Swal.close();
        
                  let datos = datos_recibidos["datos"];
                  let datosMysql = datos_recibidos["mysql"];
                  let datosNodejs = datos_recibidos["nodejs"];
                  if(datosMysql === undefined){
                    if(datosNodejs === undefined){
                      this.cerrarModalReparacion.nativeElement.click();
                      this.showModalReparacion = false;
    
                      this.tallerVehiculoById();
                    }else{
                      Swal.fire("Error en el Servidor", datosNodejs, "warning");
                    }
                  }else{
                    Swal.fire("Error en la Base de Datos", datosMysql, "warning");
                  }
                });
              }
              
            });
          }else{
            Swal.fire("Campo Vacio", "Seleccione la fecha de entrega, intente nuevamente", "warning");
          }
        }else{
          Swal.fire("Campo Vacio", "Ingrese el precio extra, intente nuevamente", "warning");
        }
        
      }else{
        Swal.fire("Campo Vacio", "Ingrese el precio de chaperio, intente nuevamente", "warning");
      }
    }else{
      Swal.fire("Campo Vacio", "Ingrese el precio de pintura, intente nuevamente", "warning");
    }
  }

  actualizarPagoSolicitud()
  {
    if(this.detalle_pago !== ""){
      if(this.listaImagenes.length > 0){
        Swal.fire({
          title: '¿Esta seguro de agregar el Pago?',
          html: "<b>Detalle: </b>" + this.detalle_pago,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Agregar'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({title: 'Agregando Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
            let parametros = {
              'id_taller_vehiculo_pago': this.id_taller_vehiculo_pago,
              'verificado': "1",
              'foto': "sin_imagen_pago.jpg",
              'detalle': this.detalle_pago,
              'id_usuario': localStorage.getItem("id_usuario")
            };
            this.http.post(this.url+"taller/actualizarPagoSolicitud", parametros).subscribe((datos_recibidos:any) => {
              Swal.close();
    
              let datos = datos_recibidos["datos"];
              let datosMysql = datos_recibidos["mysql"];
              let datosNodejs = datos_recibidos["nodejs"];
              if(datosMysql === undefined){
                if(datosNodejs === undefined){
                  this.cerrarModalPago.nativeElement.click();
                  this.showModalPago = false;

                  this.actualizarImagenPagoById();
                }else{
                  Swal.fire("Error en el Servidor", datosNodejs, "warning");
                }
              }else{
                Swal.fire("Error en la Base de Datos", datosMysql, "warning");
              }
            });
          }
          
        });
      }else{
        Swal.fire("Campo Vacio", "Seleccione una imagen del avance, intente nuevamente", "warning");
      }
    }else{
      Swal.fire("Campo Vacio", "Ingrese el detalle del avance, intente nuevamente", "warning");
    }
  }

  agregarImagenAvanceById(){
    if(this.listaImagenes.length > this.contadorImagen ) {
      Swal.fire({title: 'Agregando imagen ' + (this.contadorImagen+1) + "/" + this.listaImagenes.length,text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      const formData: FormData = new FormData();
      formData.append('imagen', this.listaImagenes[this.contadorImagen]);
      
      this.http.post(this.url+"taller/agregarImagenAvanceById/" + this.id_taller_vehiculo_avance, formData).subscribe((datos_recibidos:any) => {
        Swal.close();
        this.contadorImagen = this.contadorImagen + 1;  
        this.agregarImagenAvanceById()
      });
    }else{  
      this.listaImagenes = [];
    }
  }
  
  actualizarImagenPagoById(){
    if(this.listaImagenes.length > this.contadorImagen ) {
      Swal.fire({title: 'Agregando imagen ' + (this.contadorImagen+1) + "/" + this.listaImagenes.length,text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      const formData: FormData = new FormData();
      formData.append('imagen', this.listaImagenes[this.contadorImagen]);
      
      this.http.post(this.url+"taller/actualizarImagenPagoById/" + this.id_taller_vehiculo_pago, formData).subscribe((datos_recibidos:any) => {
        Swal.close();
        this.contadorImagen = this.contadorImagen + 1;  
        this.actualizarImagenPagoById()
      });
    }else{  
      this.listaImagenes = [];
      this.listaTallerVehiculoPagoByTalleVehiculo();
    }
  }

  tallerVehiculoById(){
    Swal.fire({title: 'Extrayendo Informacion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_taller_vehiculo": this.id_taller_vehiculo
    };

    this.http.post(this.url+"taller/tallerVehiculoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.tallerVehiculo = datos[0];
          this.id_vehiculo = this.tallerVehiculo["id_vehiculo"]
          if(this.tallerVehiculo["precio_pintura"] !== null){
            //let elemento:any = document.querySelector("#txtPintura");
            //elemento.style.display = 'none';
            this.costo_pintura = this.tallerVehiculo["precio_pintura"]
          }else{
            this.costo_pintura = 0.00
          }

          if(this.tallerVehiculo["precio_chaperio"] !== null){
           //let elemento:any = document.querySelector("#txtChaperio");
            //elemento.style.display = 'none';

            this.costo_chaperio = this.tallerVehiculo["precio_chaperio"]
          }else{
            this.costo_chaperio = 0.00
          }

          if(this.tallerVehiculo["precio_extra"] !== null){
            //let elemento:any = document.querySelector("#txtExtra");
            //elemento.style.display = 'none';

            this.costo_extra = this.tallerVehiculo["precio_extra"]
          }else{
            this.costo_extra = 0.00
          }

          if(this.tallerVehiculo["fecha_entrega"] !== null){
            //let elemento:any = document.querySelector("#txtEntrega");
            //elemento.style.display = 'none';
            let fecha = this.tallerVehiculo["fecha_entrega"].split("/")
            this.fecha_entrega = fecha[2] + "-" + fecha[1] + "-" + fecha[0]
          }else{
            this.fecha_entrega = ""
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaRepuestoByVehiculo(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
      "estado": "1"
    };
    this.http.post(this.url+"repuesto/listaRepuestoByVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaRepuesto = datos;

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  tallerVehiculoPagoById(){
    Swal.fire({title: 'Buscando Pago',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_taller_vehiculo_pago": this.id_taller_vehiculo_pago
    };

    this.http.post(this.url+"taller/tallerVehiculoPagoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.pago = datos[0];
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaTallerVehiculoPagoByTalleVehiculo(){
    Swal.fire({title: 'Buscando Pagos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_taller_vehiculo": this.id_taller_vehiculo
    };

    this.http.post(this.url+"taller/listaTallerVehiculoPagoByTalleVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaPago = datos;
        
          this.listaTallerVehiculoAvanceByTalleVehiculo();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaTallerVehiculoRepuestoByTalleVehiculo(){
    Swal.fire({title: 'Extrayendo informacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_taller_vehiculo": this.id_taller_vehiculo
    };
    this.http.post(this.url+"taller/listaTallerVehiculoRepuestoByTalleVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaDetalleRepuesto = datos;

          this.totalRepuesto = 0.00;
          for(let i=0; i<this.listaDetalleRepuesto.length; i++){
            this.totalRepuesto = this.totalRepuesto + this.listaDetalleRepuesto[i]["costo"]
          }
          
          this.listaTallerVehiculoPagoByTalleVehiculo();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaTallerVehiculoAvanceByTalleVehiculo(){
    Swal.fire({title: 'Buscando Avances',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_taller_vehiculo": this.id_taller_vehiculo
    };

    this.http.post(this.url+"taller/listaTallerVehiculoAvanceByTalleVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaAvance = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
