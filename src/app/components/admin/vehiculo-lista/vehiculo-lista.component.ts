import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ServicioSucursalService } from 'src/app/services/servicio-sucursal.service';
import { encryptNumber } from 'src/app/utils/encrypt';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculo-lista',
  templateUrl: './vehiculo-lista.component.html',
  styleUrls: ['./vehiculo-lista.component.css']
})
export class VehiculoListaComponent implements OnInit {

  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  @ViewChild('cerrarModalActualizarCliente') cerrarModalActualizarCliente:any = ElementRef;
  @ViewChild('cerrarModalListaClientes') cerrarModalListaClientes:any = ElementRef;
  @ViewChild('cerrarModalVista') cerrarModalVista:any = ElementRef;

  url:string = globals.url;
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  

  listaVehiculos:any[] = [];

  objImportacion:any;
  objRecepcion:any;

  showModalActualizarDatos:boolean = false;
  showModalActualizarCliente:boolean = false;
  showModalListaClientes:boolean = false;
  showModalVista:boolean = false;

  id_vehiculo:any = "";
  id_cliente:any = "";

  objVehiculo:any ;
  
  id_marca:any = "";
  nombre_marca:any = ""
  descripcion_marca:any = "";

  id_clase:any = "";
  nombre_clase:any = ""
  descripcion_clase:any = "";
  tipo:any = "";
  lblTitulo:any = "";

  imagenesVehiculo:any;

  countVehiculo:number = 0;

  tipoLista:any = "";

  txtBuscarCliente:any = "";

  listaMarca:any = [];
  listaClase:any = [];
  listaClientes:any = [];
  listaVista:any = [];
  listaBusquedaClientes:any = [];
  listaClientesAsociados:any = [];
  filesVehiculo:any = [];

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute, private servicioSucursal:ServicioSucursalService) { }

  ngOnInit(): void {
    if(localStorage.getItem("Importacion") != undefined){
      this.url = globals.url;
      this.tipo = this.route.snapshot.paramMap.get("tipo");
      if(this.tipo == "2"){
        this.tipo = "2,3"
        this.lblTitulo = "Vehiculos de Interes y Subasta"
      }

      if(this.tipo == "0"){
        this.lblTitulo = "Vehiculos en el Show Room"
      }

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        lengthMenu : [10, 25, 50],
        processing: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
        }
      };

      setTimeout(()=>{
        this.listaVehiculosByTipoEstado();
        this.listaMarcaByEstado();
        this.listaClaseVehiculoByEstado();
      }, 150);
      

    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(this.dtOptions);
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  onSelectVehiculo(event:any) {
    console.log(event);
    this.filesVehiculo.push(...event.addedFiles);
  }

  onRemoveVehiculo(event:any) {
    console.log(event);
    this.filesVehiculo.splice(this.filesVehiculo.indexOf(event), 1);
  }

  click_agregarMarca(){

  }

  click_agregarClase(){

  }

  click_navegarHaciaAgregarVehiculo(){
    this.router.navigate(['/vehiculo/agregar/2/1']);
  }

  click_abrirModealActualizar(_id:string){
    this.id_vehiculo = _id;
    this.vehiculoById();
    this.showModalActualizarDatos = true;
  }

  click_abrirModalListaClientes(id_vehiculo:any){
    this.id_cliente = "";
    this.id_vehiculo = id_vehiculo;
    this.showModalListaClientes = true;

    this.listaBusquedaVehiculoByVehiculo();
  }

  click_abrirModalVista(id_vehiculo:any){
    this.id_vehiculo = id_vehiculo;
    this.showModalVista = true;

    this.listaClienteVehiculoVistaByVehiculo();
  }

  click_actualizarCliente(id_vehiculo:any){
    this.id_vehiculo = id_vehiculo;
    this.showModalActualizarCliente = true;

    if(localStorage.getItem("Clientes - Todos") != undefined){
      this.listaClientesByEstado()
      this.tipoLista = "Todos los clientes en el sistema"
    }else{
      this.listaClientesByUsuarioEstado();
      this.tipoLista = "Clientes registrados solo por el usuario de la actual cuenta"
    }
  }

  click_seleccionarCliente(id_cliente:any){
    this.id_cliente = id_cliente;

    this.actualizarVehiculoImportacion();
  }

  click_seleccionarClienteAsociado(id_cliente:any){
    this.showModalListaClientes = false;
    this.cerrarModalListaClientes.nativeElement.click();

    this.router.navigate(['/cliente/perfil/', id_cliente]);
  }

  click_DetalleVehiculo(_valor:number, _idVehiculo:string){
    if(_valor == 0)
    {
      
      this.recepcionByVehiculo(_idVehiculo);
    }
    else if(_valor == 1)
    {
      this.importacionByIdVehiculo(_idVehiculo);
      
      
    }
  }

  agregarClienteBusqueda(){
    if(this.id_cliente == "")
    {
      Swal.fire("Campo Vacio", "Seleccione un cliente para asociar.", "warning");
    } else if (this.id_vehiculo == "")
    {
      Swal.fire("Campo Vacio", "El campo clase de vehiculo se encuentra vacio.", "warning");
    }
    else
    {
      let parametros = {
        'id_cliente': this.id_cliente,
        'id_vehiculo': this.id_vehiculo,
        'id_usuario': localStorage.getItem("id_usuario"),
        'nivel_interes': "0",
        'estado': "1"
      };
  
      Swal.fire({title: 'Asociando Cliente',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "cliente/agregarClienteBusqueda", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            this.listaBusquedaVehiculoByVehiculo();
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

  eliminarImagenById(_img:string){
    let parametros = {
      "imagen": _img, 
      "id_vehiculo": this.id_vehiculo
    };

    Swal.fire({title: 'Actualizando imagenes. . .',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "vehiculo/eliminarImagenById", parametros).subscribe((datos_recibidos:any) => {
      
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          if(datos.affectedRows == 1){
            this.vehiculoById();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarVehiculoImportacion(){
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
      "id_usuario": localStorage.getItem("id_usuario"),
      "id_cliente": this.id_cliente,
      "hr_latitud": '0',
      "hr_longitud": '0',
      "hr_dispositivo": localStorage.getItem("dispositivo"),
      "hr_id_usuario": localStorage.getItem("id_usuario")
    };
  
    Swal.fire({title: 'Actualizando Cliente. . .',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "importacion/actualizarVehiculoImportacion", parametros).subscribe((datos_recibidos:any) => {
      
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1){

            this.cerrarModalActualizarCliente.nativeElement.click();
            this.showModalActualizarCliente = false;
            this.listaVehiculosByTipoEstado();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarVehiculoById(){
    let parametros = {
      "id_marca": this.objVehiculo.id_marca, 
      "id_clase_vehiculo": this.objVehiculo.id_clase_vehiculo,
      "tipo": this.objVehiculo.tipo,
      "version": this.objVehiculo.version,
      "anho": this.objVehiculo.anho,
      "pais": this.objVehiculo.pais,
      "traccion": this.objVehiculo.traccion,
      "color": this.objVehiculo.color,
      "turbo": this.objVehiculo.turbo,
      "nro_lote": this.objVehiculo.nro_lote,
      "caja": this.objVehiculo.caja,
      "cilindrada": this.objVehiculo.cilindrada,
      "nro_puerta": this.objVehiculo.nro_puerta,
      "kilometraje": this.objVehiculo.kilometraje,
      "placa": this.objVehiculo.placa,
      "nro_copia": this.objVehiculo.nro_copia,
      "observacion": this.objVehiculo.observacion,
      "id": this.objVehiculo.id,
      "hr_latitud": '0',
      "hr_longitud": '0',
      "hr_dispositivo": localStorage.getItem("dispositivo"),
      "hr_id_usuario": localStorage.getItem("id_usuario")
    };
  
    Swal.fire({title: 'Actualizando información Servicio de la sucursal. . .',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "vehiculo/actualizarVehiculoById", parametros).subscribe((datos_recibidos:any) => {
      
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1){

            if(this.filesVehiculo.length > 0){
              this.agregarImagenVehiculoById();
            }

            this.cerrarModal.nativeElement.click();
            this.showModalActualizarDatos = false;
            this.listaVehiculosByTipoEstado();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
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

  importacionByIdVehiculo(_idVehiculo:string)
  {
    Swal.fire({title: 'Buscando vehiculos. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": _idVehiculo
    };

    this.http.post(this.url+"importacion/importacionByIdVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();
      
      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.objImportacion = datos[0];

          this.servicioSucursal.setIdSucursal(this.objImportacion.id_sucursal);
          
          this.router.navigate(['/sucursal/importacion/detalle/', encryptNumber(this.objImportacion.id_sucursal+''), encryptNumber(this.objImportacion.id_importacion_vehiculo+'')]);
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  recepcionByVehiculo(_idVehiculo:string){
    Swal.fire({title: 'Buscando vehiculos. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": _idVehiculo
    };

    this.http.post(this.url+"recepcion/recepcionByVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.objRecepcion = datos[0];
          this.servicioSucursal.setIdSucursal(this.objRecepcion.id_sucursal);
          
          this.router.navigate(['/sucursal/recepcion/detalle/', encryptNumber(this.objRecepcion.id_sucursal+''), encryptNumber(this.objRecepcion.id_recepcion+'')]);
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  vehiculoById(){
    Swal.fire({title: 'Buscando registros. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo
    };
    this.http.post(this.url+"vehiculo/vehiculoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.objVehiculo = datos[0];
          this.imagenesVehiculo = [];
          let imagenes = this.objVehiculo.foto.split(",");
          this.imagenesVehiculo = imagenes;
          
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaVehiculosByTipoEstado()
  {
    Swal.fire({title: 'Buscando vehiculos. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "tipo": this.tipo,
      "estado": "1"
    };
    this.http.post(this.url+"vehiculo/listaVehiculosByTipoEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaVehiculos = datos;
          console.log(this.listaVehiculos)
          for(let i=0;i<this.listaVehiculos.length;i++){
            let imagenes = this.listaVehiculos[i].foto.split(",");
            this.listaVehiculos[i].foto = imagenes;
            this.listaVehiculos[i].foto_uno = imagenes[0];
          }
          
          
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

  listaClientesBySucursalLike()
  {
    Swal.fire({title: 'Buscando Clientes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_sucursal": localStorage.getItem("sucursal"),
      "valor": this.txtBuscarCliente,
      "estado": "1"
    };

    this.http.post(this.url+"cliente/listaClientesBySucursalLike", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaBusquedaClientes = datos;
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

  listaBusquedaVehiculoByVehiculo()
  {
    Swal.fire({title: 'Buscando Clientes',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
      "estado": "1"
    };
    this.http.post(this.url+"cliente/listaBusquedaVehiculoByVehiculo", parametros).subscribe((datos_recibidos:any) => {
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

  listaClienteVehiculoVistaByVehiculo()
  {
    Swal.fire({title: 'Buscando Visualizaciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
      "estado": "1"
    };
    this.http.post(this.url+"cliente/listaClienteVehiculoVistaByVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaVista = datos;
          for(let i=0; i<this.listaVista.length; i++){
            if(this.listaVista[i]["id_cliente"] == "1"){
              this.listaVista[i]["cliente"] = "Cliente no Registrado";
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