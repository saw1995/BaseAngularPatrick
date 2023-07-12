import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
declare const google: any;

@Component({
  selector: 'app-usuario-perfil',
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.css']
})
export class UsuarioPerfilComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  url:string = globals.url;

  id_usuario:string = decryptNumber(this.router.snapshot.paramMap.get("id_usuario"));

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;

  map:any;
  @ViewChild('mapElement') mapElement: any;

  showModalCambiarClave:boolean = false;
  showModalUbicacionMaps:boolean = false;

  ci_usuario:string  = '';
  expedicion_usuario:string = '';
  genero_usuario:string = '';
  estado_civil_usuario:string = '';
  nombre_usuario:string = '';
  apellido_paterno_usuario:string = '';
  apellido_materno_usuario:string = '';
  fecha_nacimiento_usuario:string = '';
  estudio_usuario:string = '';
  correo_usuario:string = '';
  telefono_usuario:string = '';
  edad_usuario:string = '';

  departamento:string = '';
  provincia:string = '';
  municipio_usuario:string = '';
  id_municipio:string = '';

  zona_usuario:string = '';
  avenida_usuario:string = '';
  calle_usuario:string = '';
  numero_casa_usuario:string = '';
  referencia_usuario:string = '';
  imagen_usuario:string = 'sin_imagen_usuario.jpg';

  id_rol:string = '';
  nombre_rol:string = '';
  password:string = '';

  passAnterior:string = '';
  passNuevo_uno:string = '';
  passNuevo_dos:string = '';

  usuario_habilitado:boolean = false;

  labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  labelIndex = 0;
  markersArray:any = [];

  listaVenta:any;
  listaLogin:any;

  constructor(private router: ActivatedRoute, private http:HttpClient, private datePipe:DatePipe, private nav:Router){ }

  ngOnInit(): void {
    if(localStorage.getItem("Usuarios") != undefined){
      this.url = globals.url;

      this.usuarioById();

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        lengthMenu : [10, 25, 50],
        processing: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
        }
      };
      
    }else{
      this.nav.navigate(['/restriccion']);
    }
    
  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: -16.540246638894946, lng: -64.79782730340958},
      zoom: 5
    });
    google.maps.event.addListener(this.map, "click", (event:any) => {
     
    });
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  clickNavegarHaciaActualizarUsuario(){
    this.nav.navigate(['/usuario/editar', encryptNumber(this.id_usuario)]);
  }

  clickActualizarClave(){
    this.showModalCambiarClave = true;
  }

  clickVerPuntoMapsGoogle(){
    this.showModalUbicacionMaps = true;
  }

  actualizarEstadoById(_estado:number){    
       
      Swal.fire({title: 'Actualizando estado',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      let parametros = {
        "estado": _estado,
        "id": this.id_usuario,
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };

      this.http.post(this.url+"usuario/actualizarEstadoById", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.usuarioById();
            }

          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
  
      });
  }

  actualizarPassById(){    
    
    if(this.passAnterior == '' || this.passNuevo_uno == '' || this.passNuevo_dos == '')
    {
      Swal.fire("Error en validación", "Error en validar datos no pueden existir campos vacíos, intente nuevamente. . .", "warning");
    }
    else if(this.password != this.passAnterior)
    {
      Swal.fire("Error en validación", "La contraseña que inserto es incorrecta, intente nuevamente. . .", "warning");
      this.passAnterior = '';
    }
    else if(this.passNuevo_uno != this.passNuevo_dos)
    {
      Swal.fire("Error en validación", "No coincide la nueva contraseña con la que inserto, intente nuevamente. . .", "warning");
      this.passNuevo_dos = '';
    }
    else
    {
     
      Swal.fire({title: 'Actualizando Contraseña',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      let parametros = {
        "pass": this.passNuevo_dos ,
        "id": this.id_usuario,
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
      this.http.post(this.url+"usuario/actualizarPassById", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.password = this.passNuevo_dos;

              this.passAnterior = ''; 
              this.passNuevo_uno = '';
              this.passNuevo_dos = '';
              this.showModalCambiarClave = false;
              this.cerrarModal.nativeElement.click();
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

  usuarioById(){

    Swal.fire({title: 'Buscando registros',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_empresa": localStorage.getItem("id_empresa"),
      "id": this.id_usuario
    };
    this.http.post(this.url+"usuario/usuarioById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.ci_usuario = datos[0].ci;
          this.expedicion_usuario = datos[0].ci_exp;
          this.nombre_usuario = datos[0].nombre;
          this.apellido_paterno_usuario = datos[0].appat;
          this.apellido_materno_usuario = datos[0].apmat;
          this.correo_usuario = datos[0].email;
          this.telefono_usuario = datos[0].celular;
          this.genero_usuario = datos[0].genero;
          this.fecha_nacimiento_usuario = datos[0].fecha_nacimiento;
        
          this.estado_civil_usuario = datos[0].estado_civil;
          this.estudio_usuario = datos[0].estudio;
          this.zona_usuario = datos[0].zona;
          this.avenida_usuario = datos[0].avenida;
          this.calle_usuario = datos[0].calle;
          this.numero_casa_usuario = datos[0].numero;
          this.referencia_usuario = datos[0].referencia;

          this.usuario_habilitado = datos[0].estado == '1' ? true: false;

          this.departamento = datos[0].departamento;
          this.provincia = datos[0].provincia;
          this.id_municipio = datos[0].id_departamento;
          this.id_rol = datos[0].id_rol;
          this.nombre_rol = datos[0].nombre_rol;
          this.imagen_usuario = datos[0].foto;
          this.edad_usuario = datos[0].edad;
          this.municipio_usuario = datos[0].municipio;

          this.password = datos[0].pass;

          let posicion = {lat: parseFloat(datos[0].latitud), lng: parseFloat(datos[0].longitud)}
          this.markersArray[0] = new google.maps.Marker({
            position: posicion,
            label: this.labels[this.labelIndex++ % this.labels.length],
          });
          this.markersArray[0].setMap(this.map);
          this.map.setCenter(posicion);
          this.map.setZoom(15);
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaVentaByIdUsuario(){
    Swal.fire({title: 'Buscando registros',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_usuario":  this.id_usuario
    };
    this.http.post(this.url+"venta/listaVentaByIdUsuario", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          this.listaVenta = datos;

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
  
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 10,
              lengthMenu : [10, 25, 50],
              processing: true,
              language: {
                url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
              }
            };
            this.dtTrigger.next(this.dtOptions);
          });

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaLoginUsuarioByUsuario(){
    Swal.fire({title: 'Buscando registros',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_usuario":  this.id_usuario,
      "estado": "1"
    };
    this.http.post(this.url+"usuario/listaLoginUsuarioByUsuario", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaLogin = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
