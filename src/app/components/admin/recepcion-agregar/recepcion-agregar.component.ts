import { Component, ElementRef, OnInit,ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
declare var $: any;


@Component({
  selector: 'app-recepcion-agregar',
  templateUrl: './recepcion-agregar.component.html',
  styleUrls: ['./recepcion-agregar.component.css']
})
export class RecepcionAgregarComponent implements OnInit {
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url:string = globals.url;
  id_sucursal:any;

  id_marca:any = "";
  nombre_marca:any = ""
  descripcion_marca:any = "";

  id_clase:any = "";
  nombre_clase:any = ""
  descripcion_clase:any = "";

  id_vehiculo:any = "";
  tipo_vehiculo:any = "";
  version_vehiculo:any = "";
  anho_vehiculo:any = "";
  pais_vehiculo:any = "";
  color_vehiculo:any = "";
  traccion_vehiculo:any = "";
  turbo_vehiculo:any = 0;
  caja_vehiculo:any = "";
  cilindrada_vehiculo:any = "";
  nro_puerta_vehiculo:any = "";
  kilometraje_vehiculo:any = "";
  placa_vehiculo:any = "";
  nro_copia_vehiculo:any = "";
  precio_propietario_vehiculo:any = "";
  precio_venta_vehiculo:any = "";
  observacion_vehiculo:any = "";

  seleccion_todo_accesorio = 0;

  extinguidor_accesorio:number = 0;
  estuche_herramienta_accesorio:number = 0;
  fundas_accesorio:number = 0;
  cabezales_accesorio:number = 0;
  sobrepiso_accesorio:number = 0;
  quitasol_accesorio:number = 0;
  ceniceros_accesorio:number = 0;
  encendedor_accesorio:number = 0;
  manual_accesorio:number = 0;
  radio_accesorio:number = 0;
  mataburro_accesorio:number = 0;
  halogenos_accesorio:number = 0;
  limpia_parabrisas_accesorio:number = 0;
  antena_accesorio:number = 0;
  espejos_accesorio:number = 0;
  tapacubos_accesorio:number = 0;
  emblemas_accesorio:number = 0;
  
  soat_accesorio:number = 0;
  inspeccion_accesorio:number = 0;
  alarma_accesorio:number = 0;
  tapa_tanque_accesorio:number = 0;
  gata_accesorio:number = 0;
  manivela_accesorio:number = 0;
  llave_rueda_accesorio:number = 0;
  dado_seguridad_accesorio:number = 0;
  triangulo_accesorio:number = 0;
  botiquin_accesorio:number = 0;
  llanta_auxilio_accesorio:number = 0;
  detalle_pintura_accesorio:number = 0;
  estado_llanta_accesorio:number = 0;
  nro_bateria_accesorio:number = 0;
  gasolina_accesorio:number = 0;
  observacion_accesorio:number = 0;

  nombre_recepcion:any = "";
  ci_recepcion:any = "";
  telefono_recepcion:any = "";
  direccion_recepcion:any = "";
  observacion_recepcion:any = "";

  id_sucursal_parqueo:any = ""
  id_parqueo:any = ""
  observacion_parqueo:any = "";

  showModalAgregarMarca:boolean = false;
  showModalAgregarClase:boolean = false;

  countVehiculo:number = 0;
  countAccesorio:number = 0;
  filesMarca: File[] = [];
  filesClase: File[] = [];
  filesVehiculo: File[] = [];
  filesAccesorio: File[] = [];

  listaMarca:any = [];
  listaClase:any = [];
  listaSucursal:any = [];
  listaParqueo:any = [];

  constructor(private location: Location, private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioSucursal: ServicioSucursalService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Sucursales") != undefined){
      this.url = globals.url;  
      this.id_sucursal = decryptNumber(this.route.snapshot.paramMap.get("id_sucursal"));
      this.servicioSucursal.setIdSucursal(this.id_sucursal);

      $('#wizard').smartWizard();

		  $('#wizard_verticle').smartWizard({
		    transitionEffect: 'slide'
		  });
    
		  $('.buttonNext').addClass('btn btn-danger');
		  $('.buttonPrevious').addClass('btn btn-primary');
		  $('.buttonFinish').addClass('btn btn-default');

      this.listaMarcaByEstado();
      this.listaClaseVehiculoByEstado();
      this.listaSucursalByIdRol();

    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  click_agregarMarca(){
    this.showModalAgregarMarca = true;
  }

  click_agregarClase(){
    this.showModalAgregarClase = true;
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

  onSelectVehiculo(event:any) {
    console.log(event);
    this.filesVehiculo.push(...event.addedFiles);
  }

  onRemoveVehiculo(event:any) {
    console.log(event);
    this.filesVehiculo.splice(this.filesVehiculo.indexOf(event), 1);
  }

  onSelectAccesorio(event:any) {
    console.log(event);
    this.filesAccesorio.push(...event.addedFiles);
  }

  onRemoveAccesorio(event:any) {
    console.log(event);
    this.filesAccesorio.splice(this.filesAccesorio.indexOf(event), 1);
  }

  onSelectClase(event:any) {
    console.log(event);
    if(this.filesClase && this.filesClase.length >=1) {
      this.onRemoveAccesorio(this.filesClase[0]);
    }
    this.filesClase.push(...event.addedFiles);
  }

  onRemoveClase(event:any) {
    console.log(event);
    this.filesClase.splice(this.filesClase.indexOf(event), 1);
  }

  clickSeleccionTodo(){
    this.seleccion_todo_accesorio = this.seleccion_todo_accesorio == 1 ? 0:1;

    if(this.seleccion_todo_accesorio==1){

      this.extinguidor_accesorio = 1;
      this.estuche_herramienta_accesorio = 1;
      this.fundas_accesorio = 1;
      this.ceniceros_accesorio = 1;
      this.encendedor_accesorio = 1;
      this.manual_accesorio = 1;
      this.radio_accesorio = 1;
      this.mataburro_accesorio = 1;
      this.halogenos_accesorio = 1;
      this.antena_accesorio = 1;
      this.soat_accesorio = 1;
      this.inspeccion_accesorio = 1;
      this.alarma_accesorio = 1;
      this.tapa_tanque_accesorio = 1;
      this.gata_accesorio = 1;
      this.manivela_accesorio = 1;
      this.llave_rueda_accesorio = 1;
      this.dado_seguridad_accesorio = 1;
      this.triangulo_accesorio = 1;
      this.botiquin_accesorio = 1;
      this.llanta_auxilio_accesorio = 1;
    }
    else{
      this.extinguidor_accesorio = 0;
      this.estuche_herramienta_accesorio = 0;
      this.fundas_accesorio = 0;
      this.ceniceros_accesorio = 0;
      this.encendedor_accesorio = 0;
      this.manual_accesorio = 0;
      this.radio_accesorio = 0;
      this.mataburro_accesorio = 0;
      this.halogenos_accesorio = 0;
      this.antena_accesorio = 0;
      this.soat_accesorio = 0;
      this.inspeccion_accesorio = 0;
      this.alarma_accesorio = 0;
      this.tapa_tanque_accesorio = 0;
      this.gata_accesorio = 0;
      this.manivela_accesorio = 0;
      this.llave_rueda_accesorio = 0;
      this.dado_seguridad_accesorio = 0;
      this.triangulo_accesorio = 0;
      this.botiquin_accesorio = 0;
      this.llanta_auxilio_accesorio = 0;
    }
  }
  agregarVehiculo(){
    if(this.nombre_recepcion == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre del propietario no puede ser vacío.", "warning");
    }else if(this.ci_recepcion == "")
    {
      Swal.fire("Error al validar los datos", "El campo C.I. del Propietario no puede ser vacío.", "warning");
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
        'traccion': this.traccion_vehiculo,
        'color': this.color_vehiculo,
        'turbo': this.turbo_vehiculo,
        'nro_lote': '',
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
        'importacion_local':0,
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
              this.agregarVehiculoAccesorio()
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

  agregarVehiculoAccesorio(){
    if(this.nombre_recepcion == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre del propietario no puede ser vacío.", "warning");
    }else if(this.ci_recepcion == "")
    {
      Swal.fire("Error al validar los datos", "El campo C.I. del Propietario no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        'id_vehiculo': this.id_vehiculo,
        'extinguidor': this.extinguidor_accesorio,
        'estuche_herramientas': this.estuche_herramienta_accesorio,
        'fundas': this.fundas_accesorio,
        'cabezales': this.cabezales_accesorio,
        'sobrepiso': this.sobrepiso_accesorio,
        'quitasol': this.quitasol_accesorio,
        'ceniceros': this.ceniceros_accesorio,
        'encendedor': this.encendedor_accesorio,
        'manual': this.manual_accesorio,
        'radio': this.radio_accesorio,
        'mataburro': this.mataburro_accesorio,
        'halogenos': this.halogenos_accesorio,
        'limpia_parabrisas': this.limpia_parabrisas_accesorio,
        'antena': this.antena_accesorio,
        'espejos': this.espejos_accesorio,
        'tapacubos': this.tapacubos_accesorio,
        'emblemas': this.emblemas_accesorio,
        'stoat': this.soat_accesorio,
        'inspeccion': this.inspeccion_accesorio,
        'alarma': this.alarma_accesorio,
        'tapa_tanque': this.tapa_tanque_accesorio,
        'gata': this.gata_accesorio,
        'manivela': this.manivela_accesorio,
        'llave_rueda': this.llave_rueda_accesorio,
        'dado_seguridad': this.dado_seguridad_accesorio,
        'triangulo': this.triangulo_accesorio,
        'botiquin': this.botiquin_accesorio,
        'llanta_auxilio': this.llanta_auxilio_accesorio,
        'detalle_pintura': this.detalle_pintura_accesorio,
        'estado_llanta': this.estado_llanta_accesorio,
        'nro_bateria': this.nro_bateria_accesorio,
        'gasolina': this.gasolina_accesorio,
        'observacion': this.observacion_accesorio,
        'foto': "sin_imagen_accesorio.jpg",
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
  
      Swal.fire({title: 'Agregando Accesorios',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "vehiculo/agregarVehiculoAccesorio", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.agregarRecepcion();
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

  agregarRecepcion(){
    if(this.nombre_recepcion == "")
    {
      Swal.fire("Error al validar los datos", "El campo nombre del propietario no puede ser vacío.", "warning");
    }else if(this.ci_recepcion == "")
    {
      Swal.fire("Error al validar los datos", "El campo C.I. del Propietario no puede ser vacío.", "warning");
    }
    else
    {
      let parametros = {
        'id_sucursal': this.id_sucursal,
        'id_vehiculo': this.id_vehiculo,
        'nombre_propietario': this.nombre_recepcion,
        'ci_propietario': this.ci_recepcion,
        'direccion_propietario': this.direccion_recepcion,
        'telefono_propietario': this.telefono_recepcion,
        'observacion': this.observacion_recepcion,
        'id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };
  
      Swal.fire({title: 'Agregando Recepcion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "recepcion/agregarRecepcion", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.agregarParqueoVehiculoEntrada();
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

  agregarParqueoVehiculoEntrada(){
    let parametros = {
      'id_parqueo': this.id_parqueo,
      'id_sucursal': this.id_sucursal,
      'id_vehiculo': this.id_vehiculo,
      'observacion_entrada': 'Ingreso de Recepción - ' + this.observacion_parqueo,
      'id_usuario_entrada': localStorage.getItem("id_usuario"),
      'hr_dispositivo': localStorage.getItem("dispositivo"),
      'hr_latitud': '0',
      'hr_longitud': '0'
    };

    Swal.fire({title: 'Agregando Parqueo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "parqueo/agregarParqueoVehiculoEntrada", parametros).subscribe((datos_recibidos:any) => 
    {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            if(this.filesVehiculo.length > 0){
              this.agregarImagenVehiculoById()
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

  agregarImagenVehiculoById(){
    if(this.filesVehiculo.length > this.countVehiculo ) {
      Swal.fire({title: 'Agregando imagen ' + (this.countVehiculo+1) + "/" + this.filesVehiculo.length,text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      const formData: FormData = new FormData();
      formData.append('imagen', this.filesVehiculo[this.countVehiculo]);
      
      this.http.post(this.url+"vehiculo/agregarImagenVehiculoById/" + this.id_vehiculo, formData).subscribe((datos_recibidos:any) => {
        Swal.close();
        this.countVehiculo = this.countVehiculo + 1;  
        this.agregarImagenVehiculoById()
      });
    }else{
      console.log('fin');      
      this.filesVehiculo = [];

      if(this.filesAccesorio.length > 0){
        this.agregarImagenVehiculoAccesorioById()
      }
    }
  }

  agregarImagenVehiculoAccesorioById(){
    if(this.filesAccesorio.length > this.countAccesorio ) {
      Swal.fire({title: 'Agregando imagen accesorios' + (this.countAccesorio+1) + "/" + this.filesAccesorio.length,text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      const formData: FormData = new FormData();
      formData.append('imagen', this.filesAccesorio[this.countAccesorio]);
      
      this.http.post(this.url+"vehiculo/agregarImagenVehiculoAccesorioById/" + this.id_vehiculo, formData).subscribe((datos_recibidos:any) => {
        Swal.close();
        this.countAccesorio = this.countAccesorio + 1;  
        this.agregarImagenVehiculoAccesorioById()
      });
    }else{
      console.log('fin');      
      this.filesAccesorio = [];
      this.location.back();
    }
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

  listaSucursalByIdRol()
  {
    Swal.fire({title: 'Buscando Sucursales',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1,
      "id_rol": localStorage.getItem("id_rol")
    };
    this.http.post(this.url+"sucursal/listaSucursalByIdRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaSucursal = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaParqueoByIdSucursalByRol()
  {
    this.listaParqueo = []
    this.id_parqueo = "";

    Swal.fire({title: 'Buscando Parqueos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": 1,
      "id_rol": localStorage.getItem("id_rol"),
      "id_sucursal": this.id_sucursal_parqueo
    };
    this.http.post(this.url+"parqueo/listaParqueoByIdSucursalByRol", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaParqueo = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }
}
