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
  selector: 'app-taller-pago-general',
  templateUrl: './taller-pago-general.component.html',
  styleUrls: ['./taller-pago-general.component.css']
})
export class TallerPagoGeneralComponent implements OnInit {
  @ViewChild('cerrarModalSolicitarPago') cerrarModalSolicitarPago:any = ElementRef;
  @ViewChild('cerrarModalPago') cerrarModalPago:any = ElementRef;
  @ViewChild('cerrarModalPagoDetalle') cerrarModalPagoDetalle:any = ElementRef;
  @ViewChild('cerrarModalImagen') cerrarModalImagen:any = ElementRef;

  showModalSolicitarPago:boolean = false;
  showModalPago:boolean = false;
  showModalPagoDetalle:boolean = false;

  url:string = globals.url;

  id_sucursal:any = "";
  id_taller_vehiculo_pago:any = "";
  id_taller_vehiculo:any = "";
  
  detalle_pago:any = "";
  detalle_solicitud:any = "";
  total:any = "";
  pago_tipo:any = "";

  pago:any;
  listaPago:any = [];

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

      this.listaTallerVehiculoPagoByEstado();
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

  click_agregarPago(id:any, id_taller_vehiculo:any){
    this.listaImagenes = [];
    this.showModalPago = true;
    this.id_taller_vehiculo_pago = id;
    this.id_taller_vehiculo = id_taller_vehiculo;
  }


  click_detallePago(id:any, id_taller_vehiculo:any){
    this.showModalPagoDetalle = true;
    this.id_taller_vehiculo_pago = id;
    this.id_taller_vehiculo = id_taller_vehiculo;

    this.tallerVehiculoPagoById();
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
                    this.listaTallerVehiculoPagoByEstado();
      
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
      this.listaTallerVehiculoPagoByEstado();
    }
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

  listaTallerVehiculoPagoByEstado(){
    Swal.fire({title: 'Buscando Pagos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1"
    };

    this.http.post(this.url+"taller/listaTallerVehiculoPagoByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaPago = datos;
        
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

}
