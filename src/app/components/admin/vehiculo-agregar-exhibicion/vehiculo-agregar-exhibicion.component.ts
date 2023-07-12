import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent } from 'ngx-image-cropper';
declare var $: any;

@Component({
  selector: 'app-vehiculo-agregar-exhibicion',
  templateUrl: './vehiculo-agregar-exhibicion.component.html',
  styleUrls: ['./vehiculo-agregar-exhibicion.component.css']
})
export class VehiculoAgregarExhibicionComponent implements OnInit {
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  @ViewChild('cerrarModalColor') cerrarModalColor:any = ElementRef;
  @ViewChild('cerrarModalTraccion') cerrarModalTraccion:any = ElementRef;
  @ViewChild('cerrarModalImagen') cerrarModalImagen:any = ElementRef;

  url:string = globals.url;
  id_sucursal:any;
  id_cliente:any;
  tipo:any;

  id_marca:any = "";
  nombre_marca:any = ""
  descripcion_marca:any = "";

  id_clase:any = "";
  nombre_clase:any = ""
  descripcion_clase:any = "";

  id_color:any = "";
  color:any = "";
  id_traccion:any = "";
  traccion:any = "";

  id_vehiculo:any = "";
  tipo_vehiculo:any = "";
  version_vehiculo:any = "";
  anho_vehiculo:any = "";
  pais_vehiculo:any = "";
  color_vehiculo:any = "";
  traccion_vehiculo:any = "";
  nro_lote:any = "";
  vin:any = "0";
  turbo_vehiculo:any = 0;
  caja_vehiculo:any = "";
  cilindrada_vehiculo:any = "";
  nro_puerta_vehiculo:any = "";
  kilometraje_vehiculo:any = "";
  placa_vehiculo:any = "0";
  nro_copia_vehiculo:any = "0";
  precio_propietario_vehiculo:any = "0.0";
  precio_venta_vehiculo:any = "0.0";
  observacion_vehiculo:any = "";
  link:any = "";
  plataforma:any = "";
  fecha_subasta:any = "";
  hora_subasta:any = "";
  importacion_local:any = "1";
  titulo_precio:any = "";

  showModalAgregarMarca:boolean = false;
  showModalAgregarClase:boolean = false;
  showModalColor:boolean = false;
  showModalTraccion:boolean = false;

  countVehiculo:number = 0;
  filesMarca: File[] = [];
  filesClase: File[] = [];

  listaMarca:any = [];
  listaClase:any = [];
  listaTraccion:any = [];
  listaColor:any = [];

  showModalImagen:Boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  listaImagenes: File[] = [];
  listaPrevia:any = [];
  variasImagenes:boolean = true;
  contadorImagen:any = 0;

  constructor(private location: Location, private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioSucursal: ServicioSucursalService, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {

    if(localStorage.getItem("Vehiculos") != undefined){
      $('#wizard').smartWizard();

      $('#wizard_verticle').smartWizard({
        transitionEffect: 'slide'
      });
    
      $('.buttonNext').addClass('btn btn-danger');
      $('.buttonPrevious').addClass('btn btn-primary');
      $('.buttonFinish').addClass('btn btn-default');

      this.id_cliente =this.route.snapshot.paramMap.get("id_cliente");
      this.tipo =this.route.snapshot.paramMap.get("tipo");

      this.fecha_subasta = "2020-01-01";
      this.hora_subasta = "00:00:00";
      this.nro_lote = "0";
      this.placa_vehiculo = "0";
      this.nro_copia_vehiculo = "0";
      this.precio_propietario_vehiculo = "0";
      this.precio_venta_vehiculo = "0";
      this.plataforma = "";
      this.link = "";

      if(this.tipo == "0"){
        let elemento:any = document.querySelector("#groupLote");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupVin");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPlaca");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupCopia");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupPrecioPropietario");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupPrecioVenta");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupFecha");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupHora");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPlataforma");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupLink");
        elemento.style.display = 'none';
        this.titulo_precio = "Precio de Venta"
        this.nro_lote = "0";
        this.placa_vehiculo = "0";
        this.nro_copia_vehiculo = "0";
        this.precio_propietario_vehiculo = "0";
        this.precio_venta_vehiculo = "0";
        this.importacion_local = "0";
        this.plataforma = "";
        this.link = "";
      }

      if(this.tipo == "1"){
        let elemento:any = document.querySelector("#groupLote");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupVin");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupPlaca");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupCopia");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPrecioPropietario");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPrecioVenta");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupFecha");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupHora");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPlataforma");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupLink");
        elemento.style.display = 'block';
        this.titulo_precio = "Precio de Importación"
        this.importacion_local = "1";
      }
      if(this.tipo == "2"){
        let elemento:any = document.querySelector("#groupLote");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupVin");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupPlaca");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupCopia");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPrecioPropietario");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPrecioVenta");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupFecha");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupHora");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupPlataforma");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupLink");
        elemento.style.display = 'block';
        this.titulo_precio = "Precio de Subasta"
        this.importacion_local = "2";
      }
      if(this.tipo == "3"){
        let elemento:any = document.querySelector("#groupLote");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupVin");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupPlaca");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupCopia");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPrecioPropietario");
        elemento.style.display = 'none';
        elemento = document.querySelector("#groupPrecioVenta");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupFecha");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupHora");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupPlataforma");
        elemento.style.display = 'block';
        elemento = document.querySelector("#groupLink");
        elemento.style.display = 'block';
        this.titulo_precio = "Precio de Subasta"
        this.importacion_local = "3";
      }

      setTimeout(()=>{
        this.listaMarcaByEstado();
        this.listaClaseVehiculoByEstado();
        this.listaTraccionByEstado();
        this.listaColorByEstado();
      }, 150);
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

  onSelectMarca(event:any) {
    console.log(event);
    if(this.filesMarca && this.filesMarca.length >=1) {
      this.onRemoveMarca(this.filesMarca[0]);
    }
    this.filesMarca.push(...event.addedFiles);
  }

  onRemoveMarca(event:any) {
    console.log(event);
    this.filesMarca.splice(this.filesMarca.indexOf(event), 1);
  }


  onSelectClase(event:any) {
    console.log(event);
    if(this.filesClase && this.filesClase.length >=1) {
      this.onRemoveClase(this.filesClase[0]);
    }
    this.filesClase.push(...event.addedFiles);
  }

  onRemoveClase(event:any) {
    console.log(event);
    this.filesClase.splice(this.filesClase.indexOf(event), 1);
  }

  click_agregarMarca(){
    this.showModalAgregarMarca = true;
  }

  click_agregarClase(){
    this.showModalAgregarClase = true;
  }

  click_agregarColor(){
    this.showModalColor = true;
    this.listaColorByEstado();
  }

  click_agregarTraccion(){
    this.showModalTraccion = true;
    this.listaTraccionByEstado();
  }

  click_volverRegistros(){
    this.location.back();
  }

  agregarVehiculo(){
    if(this.id_marca == "")
    {
      Swal.fire("Error al validar los datos", "El campo cliente no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        'id_marca': this.id_marca,
        'id_clase_vehiculo': this.id_clase,
        'tipo': this.tipo_vehiculo,
        'version': this.version_vehiculo,
        'anho': this.anho_vehiculo,
        'pais': this.pais_vehiculo,
        'id_traccion': this.id_traccion,
        'id_color': this.id_color,
        'nro_lote': this.nro_lote,
        'vin': this.vin,
        'turbo':this.turbo_vehiculo,
        'caja': this.caja_vehiculo,
        'cilindrada': this.cilindrada_vehiculo,
        'nro_puerta': this.nro_puerta_vehiculo,
        'kilometraje': this.kilometraje_vehiculo,
        'placa': this.placa_vehiculo,
        'nro_copia': this.nro_copia_vehiculo,
        'precio_propietario': this.precio_propietario_vehiculo,
        'precio_sugerido': this.precio_venta_vehiculo,
        'observacion': this.observacion_vehiculo,
        'foto': "sin_imagen_vehiculo.jpg",
        'estado': "1",
        'importacion_local': this.importacion_local,
        'plataforma': this.plataforma,
        'link': this.link,
        'fecha_subasta': this.fecha_subasta,
        'hora_subasta': this.hora_subasta,
        'id_sucursal': localStorage.getItem("sucursal"),
        'id_cliente': this.id_cliente,
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
  
      Swal.fire({title: 'Agregando Vehiculo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "vehiculo/agregarVehiculo", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.id_vehiculo = datos.id_vehiculo;

              if(this.listaImagenes.length > 0){
                this.agregarImagenVehiculoById();
              }else{
                this.location.back();
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

  agregarImagenVehiculoById(){
    if(this.listaImagenes.length > this.countVehiculo ) {
      Swal.fire({title: 'Agregando imagen ' + (this.countVehiculo+1) + "/" + this.listaImagenes.length,text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      const formData: FormData = new FormData();
      formData.append('imagen', this.listaImagenes[this.countVehiculo]);
      
      this.http.post(this.url+"vehiculo/agregarImagenVehiculoById/" + this.id_vehiculo, formData).subscribe((datos_recibidos:any) => {
        Swal.close();
        this.countVehiculo = this.countVehiculo + 1;  
        this.agregarImagenVehiculoById()
      });
    }else{  
      this.location.back();
      this.listaImagenes = [];
    }
  }

  agregarMarca(){
    if(this.nombre_marca == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre de marca no puede ser vacío.", "warning");
    }else if(this.descripcion_marca == "")
    {
      Swal.fire("Error al validar los datos", "El campo descripción de marca no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        'nombre': this.nombre_marca,
        'descripcion': this.descripcion_marca,
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
              this.cerrarModal.nativeElement.click();
              this.showModalAgregarMarca = false;
              this.listaMarcaByEstado();
              this.id_marca = datos.id_marca;

              if(this.filesMarca.length > 0){
                this.actualizarImagenMarcaById(this.id_marca);
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

  agregarClaseVehiculo(){
    if(this.nombre_clase == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre de la clase no puede ser vacío.", "warning");
    }else if(this.descripcion_clase == "")
    {
      Swal.fire("Error al validar los datos", "El campo descripción de la clase no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        'nombre': this.nombre_clase,
        'descripcion': this.descripcion_clase,
        'foto': 'sin_imagen_clase_vehiculo.jpg',
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
              this.cerrarModal.nativeElement.click();
              this.showModalAgregarClase = false;
              this.listaClaseVehiculoByEstado();
              this.id_clase = datos.id_clase_vehiculo;

              if(this.filesClase.length > 0){
                this.actualizarImagenClaseById(this.id_clase);
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
              this.cerrarModalColor.nativeElement.click();
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
              this.cerrarModalTraccion.nativeElement.click();
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

  actualizarImagenMarcaById(id_marca:string){
    const formData: FormData = new FormData();
    formData.append('imagen', this.filesMarca[0]);
    this.http.post(
    this.url + "marca/actualizarImagenById/" + id_marca,
    formData).subscribe((response:any) => {
      console.log("termino:" + response)
    });
  }

  actualizarImagenClaseById(id_clase:string){
    const formData: FormData = new FormData();
    formData.append('imagen', this.filesMarca[0]);
    this.http.post(
    this.url + "clase/actualizarImagenById/" + id_clase,
    formData).subscribe((response:any) => {
      console.log("termino:" + response)
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

  listaMarcaByEstado()
  {
    Swal.fire({title: 'Buscando marcas',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
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


}
