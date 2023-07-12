import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { decryptNumber, encryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-importacion-agregar',
  templateUrl: './importacion-agregar.component.html',
  styleUrls: ['./importacion-agregar.component.css']
})
export class ImportacionAgregarComponent implements OnInit, AfterViewInit, OnDestroy {
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
  nro_lote:any = "";
  caja_vehiculo:any = "";
  cilindrada_vehiculo:any = "";
  nro_puerta_vehiculo:any = "";
  kilometraje_vehiculo:any = "";
  placa_vehiculo:any = "0";
  nro_copia_vehiculo:any = "0";
  precio_propietario_vehiculo:any = "0.0";
  precio_venta_vehiculo:any = "0.0";
  observacion_vehiculo:any = "";

  id_cliente_importacion:any = '';
  cliente_seleccion:any = '';
  observacion_importacion:any = "";

  showModalAgregarMarca:boolean = false;
  showModalAgregarClase:boolean = false;
  showModalSelccionarCliente:boolean = false;

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
  listaClientes:any = [];
  
  tipoLista:any = "";

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
      
      
      if(localStorage.getItem("Clientes - Todos") != undefined){
        this.listaClientesByEstado()
        this.tipoLista = "Todos los clientes en el sistema"
      }else{
        this.listaClientesByUsuarioEstado();
        this.tipoLista = "Clientes registrados solo por el usuario de la actual cuenta"
      }

    }else{
      this.router.navigate(['/restriccion']);
    }

  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  click_abrirListaCliente(){
    this.showModalSelccionarCliente = true;
  }

  click_seleccionarCliente(_id:string, _nombre:string, _appat:string, _apmat:string){
    this.cliente_seleccion = (_nombre + ' ' + _appat + ' ' + _apmat).toUpperCase();
    this.id_cliente_importacion = _id;
    this.cerrarModal.nativeElement.click();
    this.showModalSelccionarCliente = false;
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

  onSelectAccesorio(event:any) {
    console.log(event);
    this.filesAccesorio.push(...event.addedFiles);
  }

  onRemoveAccesorio(event:any) {
    console.log(event);
    this.filesAccesorio.splice(this.filesAccesorio.indexOf(event), 1);
  }

  agregarVehiculo(){
    if(this.id_cliente_importacion == "")
    {
      Swal.fire("Campo Vacio", "El campo cliente no puede ser vacío.", "warning");
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
        'nro_lote': this.nro_lote,
        'turbo':0,
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
        'importacion_local': 1,
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
              this.agregarImportacion();
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

  agregarImportacion()
  {
    let parametros = {
      'id_sucursal': this.id_sucursal,
      'id_cliente': this.id_cliente_importacion,
      'id_vehiculo': this.id_vehiculo,
      'id_usuario': localStorage.getItem('id_usuario'),
      'observacion': this.observacion_importacion
    };

    Swal.fire({title: 'Agregando registro de importacion. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "importacion/agregarImportacion", parametros).subscribe((datos_recibidos:any) => 
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
              this.agregarImagenVehiculoById();
            }
            
            this.location.back();
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
      Swal.fire("Campo Vacio", "El campo nombre de marca se encuentra vacio.", "warning");
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

  agregarClaseVehiculo(){
    if(this.nombre_clase == "")
    {
      Swal.fire("Campo Vacio", "El campo nombre de la clase se encuentra vacio.", "warning");
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
              this.id_clase = datos.id_clase;

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

  listaClientesByEstado()
  {
    Swal.fire({title: 'Buscando Clientes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1"
    };
    this.http.post(this.url+"cliente/listaClientesByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaClientes = datos;
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaClientesByUsuarioEstado()
  {
    Swal.fire({title: 'Buscando Clientes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_usuario": localStorage.getItem("id_usuario"),
      "estado": "1"
    };
    this.http.post(this.url+"cliente/listaClientesByUsuarioEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaClientes = datos;
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

}

