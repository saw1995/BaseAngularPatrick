import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html',
  styleUrls: ['./cliente-editar.component.css']
})
export class ClienteEditarComponent implements OnInit {
  url:string = globals.url;
  @ViewChild('cerrarModalImagen') cerrarModalImagen:any = ElementRef;

  id_cliente:any = "";
  ci:string  = '0';
  expedicion:string = '';
  genero:string = '';
  nombre:string = '';
  apellido_paterno:string = '';
  apellido_materno:string = '';
  correo:string = '';
  telefono:string = '';
  id_profesion:string = '';
  departamento:string = '';
  direccion:string = '';

  tipo:any = "";
  tipo_literal:any = "";
  interes:any = "";

  id_sucursal:any = '';
  listaProfesion:any = [];

  showModalImagen:Boolean = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  listaImagenes: File[] = [];
  listaPrevia:any = [];
  variasImagenes:boolean = false;
  contadorImagen:any = 0;

  constructor(private location: Location, private http: HttpClient, public router: Router, private route: ActivatedRoute, private imageCompress: NgxImageCompressService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Clientes") != undefined){
      this.url = globals.url;
      this.id_sucursal = localStorage.getItem("sucursal");
      this.id_cliente =this.route.snapshot.paramMap.get("id_cliente");
      
      this.listaProfesionByEstado()
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

  clickNavegarHaciaAtras(){
    this.location.back();
  }

  click_rbComprador(){
    this.tipo == "0"
  }

  click_rbDuenho(){
    this.tipo == "1"
  }

  actualizarDatosClienteById(){
    Swal.fire({title: 'Actualizando Cliente',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.ci == '' || this.expedicion == '')
    {
      Swal.fire("Campo Vacio", "El campo cedula de identidad y expedición son obligatorios, intente nuevamente", "warning");
    }else if(this.genero == '')  
    {
      Swal.fire("Campo Vacio", "Debe seleccionar un genero, intente nuevamente", "warning");
    }
    else if(this.nombre == '' || this.apellido_paterno == '')
    {
      Swal.fire("Campo Vacio", "El campo nombre y apellido paterno no pueden estar vacío, son olbigatorio, intente nuevamente", "warning");
    }
    else if(this.telefono == '')
    {
      Swal.fire("Campo Vacio", "Ingrese el telefono o celular del cliente, intente nuevamente. . .", "warning");
    }
    else if(this.id_sucursal == '')
    {
      Swal.fire("Campo Vacio", "Seleccione una sucursal, intente nuevamente. . .", "warning");
    }
    else
    {
      let parametros = {
        "id_cliente": this.id_cliente,
        "ci": this.ci,
        'ci_exp': this.expedicion, 
        'nombre': this.nombre,
        'appat': this.apellido_paterno,
        'apmat': this.apellido_materno,
        'email': this.correo,
        'celular': this.telefono,
        'genero': this.genero,
        'departamento': this.departamento,
        'direccion': this.direccion,
        'id_sucursal': this.id_sucursal,
        'tipo': this.tipo,
        'interes': this.interes,
        'id_profesion': this.id_profesion,
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
  
      this.http.post(this.url + "cliente/actualizarDatosClienteById", parametros).subscribe((datos_recibidos:any) => {
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
                this.actualizarImagenClienteById(this.id_cliente);
              }else{
                this.clickNavegarHaciaAtras();
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

  actualizarImagenClienteById(id_cliente:string){
    const formData: FormData = new FormData();
    formData.append('imagen', this.listaImagenes[0]);
    this.http.post(
    this.url + "cliente/actualizarImagenClienteById/" + id_cliente,
    formData).subscribe((response:any) => {
      console.log("termino:" + response)
      this.clickNavegarHaciaAtras();
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
          this.id_profesion = datos[0].id_profesion;
          this.correo = datos[0].email;
          this.telefono = datos[0].celular;
          this.departamento = datos[0].departamento;
          this.direccion = datos[0].direccion;
          this.tipo = datos[0].tipo;
          this.interes = datos[0].interes;
          /*this.foto = datos[0].foto;
          this.cliente_usuario = datos[0].cliente_usuario;
          this.usuario = datos[0].usuario;
          this.fecha = datos[0].fecha;
          this.hora = datos[0].hora;*/


        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaProfesionByEstado(){
    Swal.fire({title: 'Buscando profesiones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1"
    };
    this.http.post(this.url+"profesion/listaProfesionByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.length > 0){
            this.listaProfesion = datos;
            this.clienteById();
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
