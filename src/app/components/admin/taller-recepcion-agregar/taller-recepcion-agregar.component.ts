import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioTallerService } from 'src/app/services/servicio-taller.service';
import { encryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-taller-recepcion-agregar',
  templateUrl: './taller-recepcion-agregar.component.html',
  styleUrls: ['./taller-recepcion-agregar.component.css']
})
export class TallerRecepcionAgregarComponent implements OnInit {

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;

  url:string = globals.url;

  shoModalSeleecionarVehiculo:Boolean = false;

  id_recepcion_importacion:any = '';
  id_taller:string = '';

  id_vehiculo:string = '';
  imagen_vehiculo:any = [];
  marca_vehiculo:any = '';
  clase_vehiculo:any = '';
  tipo_vehiculo:any = '';
  version_vehiculo:any = '';
  anho_vehiculo:any = '';

  detalle:string = '';

  listaImportacion:any=[];

  countVehiculo:number = 0;
  filesVehiculo: File[] = [];

  constructor(private http:HttpClient, private router:Router, private serviceTaller:ServicioTallerService) { }

  ngOnInit(): void {

    if(localStorage.getItem("Talleres") != undefined){
  
      this.id_taller = this.serviceTaller.getIdTaller();
      this.listaVehiculoImportacionByTallerRecepcion();
      setTimeout(()=>{
      }, 100);
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  onSelectVehiculo(event:any) {
    console.log(event);
    this.filesVehiculo.push(...event.addedFiles);
  }

  onRemoveVehiculo(event:any) {
    console.log(event);
    this.filesVehiculo.splice(this.filesVehiculo.indexOf(event), 1);
  }

  click_abrirVehiculo(){
    this.shoModalSeleecionarVehiculo = true;
  }

  click_navegarHaciaListaRecepcion(){
    this.router.navigate(['/taller/' + encryptNumber(this.id_taller) + '/recepcion']);
  }

  click_seleccionarVehiculo(_idVehiculo:string, _claseVehiculo:string, _marca:string, _tipo:string, _version:string, anho:string, imagen:string){
    this.id_vehiculo = _idVehiculo;
    this.clase_vehiculo = _claseVehiculo;
    this.marca_vehiculo = _marca;
    this.tipo_vehiculo = _tipo;
    this.version_vehiculo = _version;
    this.anho_vehiculo = anho;
    this.imagen_vehiculo = imagen.split(",");

    let elemento:any = document.querySelector("#vehiculo_seleccionado");
    elemento.style.display = 'block';

    this.shoModalSeleecionarVehiculo = false;
    this.cerrarModal.nativeElement.click();
  }

  agregarRecepcionVehiculoImportacionByTaller(){

    if(this.id_vehiculo == "")
    {
      Swal.fire("Error en alidación", 'Debe seleccionar el vehiculo disponible en la lista de importaciones. . .', "warning");
    }
    else if(this.detalle == "")
    {
      Swal.fire("Error en alidación", 'Debe agregar al menos una descripcion del vehiculo en el campo detalle. . .', "warning");
    }
    else
    {
      Swal.fire({title: 'Agregando Recepcion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      let parametros = { 
        "id_taller": this.id_taller,
        "id_vehiculo": this.id_vehiculo,
        "id_usuario":localStorage.getItem("id_usuario"),
        "detalle": this.detalle,
        "foto_detalle": '',
        "video": ''
      };
      this.http.post(this.url+"importacion/agregarRecepcionVehiculoImportacionByTaller", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows==1)
            {
              this.id_recepcion_importacion = datos.id_recepcion_importacion;
              if(this.filesVehiculo.length > 0){
                this.agregarImagenVehiculoById()
              }else{
                this.click_navegarHaciaListaRecepcion();
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
  }
  
  agregarImagenVehiculoById(){
    if(this.filesVehiculo.length > this.countVehiculo ) {
      Swal.fire({title: 'Agregando imagen ' + (this.countVehiculo+1) + "/" + this.filesVehiculo.length,text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      const formData: FormData = new FormData();
      formData.append('imagen', this.filesVehiculo[this.countVehiculo]);
      
      this.http.post(this.url+"importacion/agregarImagenRecepcionTallerById/" + this.id_recepcion_importacion, formData).subscribe((datos_recibidos:any) => {
        Swal.close();
        this.countVehiculo = this.countVehiculo + 1;  
        this.agregarImagenVehiculoById()
      });
    }else{
      console.log('fin');      
      this.filesVehiculo = [];
      this.click_navegarHaciaListaRecepcion();
    }
  }

  listaVehiculoImportacionByTallerRecepcion(){
    Swal.fire({title: 'Buscando talleres. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = { "estado": 1 };
    this.http.post(this.url+"importacion/listaVehiculoImportacionByTallerRecepcion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaImportacion = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
