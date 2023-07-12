import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-recepcion-detalle',
  templateUrl: './recepcion-detalle.component.html',
  styleUrls: ['./recepcion-detalle.component.css']
})
export class RecepcionDetalleComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  @ViewChild('tabDocumentos') tabDocumentos:any = ElementRef;
  url:string = globals.url;

  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  showModalClientes:boolean = false;
  showModalClientesInteresado:boolean = false;
  showModalGastos = false;
  showModalParqueo = false;

  id_sucursal:any;
  id_recepcion:any;
  id_vehiculo:any;
  id_accesorio:any;
  id_parqueo:any;
  id_parqueo_vehiculo:any;

  ultimoParqueo:any = "";
  titulo_ultimoParqueo:any = "Parqueo Actual";
  totalGasto:any = 0.00;

  usuario:any = "";
  fecha:any = "";
  hora:any = "";
  observacion_recepcion:any = "";
  sucursal:any = "";
  propietario:any = "";
  ci:any = "";
  direccion:any = "";
  telefono:any = "";
  venta:any = "";
  venta_estado:any = "";

  vehiculo:any = "";
  pais:any = "";
  traccion:any = "";
  color:any = "";
  motor:any = "";
  caja:any = "";
  cilindrada:any = "";
  nro_puerta:any = "";
  kilometraje:any = "";
  placa:any = "";
  nro_copia:any = "";
  precio_propietario:any = "";
  precio_venta:any = "";
  observacion_vehiculo:any = "";

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
  detalle_pintura_accesorio:string = '';
  estado_llanta_accesorio:string = '';
  nro_bateria_accesorio:string = '';
  gasolina_accesorio:string = '';
  observacion_accesorio:string = '';
  observacion_devolucion:string = '';
  
  corte10:any = 0;
  corte20:any = 0;
  corte50:any = 0;
  corte100:any = 0;
  corte200:any = 0;
  corteDolar1:any = 0;
  corteDolar2:any = 0;
  corteDolar5:any = 0;
  corteDolar10:any = 0;
  corteDolar20:any = 0;
  corteDolar50:any = 0;
  corteDolar100:any = 0;

  subTotal10:any = 0;
  subTotal20:any = 0;
  subTotal50:any = 0;
  subTotal100:any = 0;
  subTotal200:any = 0;
  subTotalDolar1:any = 0;
  subTotalDolar2:any = 0;
  subTotalDolar5:any = 0;
  subTotalDolar10:any = 0;
  subTotalDolar20:any = 0;
  subTotalDolar50:any = 0;
  subTotalDolar100:any = 0;

  subTotalBolivianos:any = 0;
  subTotalDolares:any = 0;
  totalBolivianos:any = 0;
  totalDolares:any = 0;

  glosa:any = "";
  monto:any = "";
  moneda:any = "";
  nombre_origen:any = "";
  cuenta_origen:any = "";
  banco_origen:any = "";
  cuenta_destino:any = "";
  banco_destino:any = "";

  imagen_vehiculo:any = [];
  imagen_accesorio:any = [];
  imagen_accesorio_simple:any = "";

  con_accesorios:any = [];
  sin_accesorios:any = [];

  listaClientes:any;
  listaClienteInteresado:any;
  listaParqueoVehiculo:any = [];
  listaGastos:any = [];

  id_cliente_seleccionado:string = '';
  cliente_seleccionado:string = '';

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(localStorage.getItem("Sucursales") != undefined){
      this.url = globals.url;  
      this.id_sucursal = decryptNumber(this.route.snapshot.paramMap.get("id_sucursal"));
      this.id_recepcion = decryptNumber(this.route.snapshot.paramMap.get("id_recepcion"));
      
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        lengthMenu : [10, 25, 50],
        processing: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
        }
      };

      this.recepcionById();
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

  click_clientesInteresados(){
    this.listaClientesByUsuarioEstado();
  }

  click_abrirClientes()
  {
    this.showModalClientes = true;
  }

  click_abrirClienteInteresados(){
    this.showModalClientesInteresado = true;
  }

  click_abrirGastos(){
    this.showModalGastos = true;
  }

  click_abrirParqueo(){
    this.showModalParqueo = true;
  }

  click_seleccionarCliente(_id:string, _nombre:string, _appat:string, apmat:string){
    this.id_cliente_seleccionado = _id;
    this.cliente_seleccionado = _nombre + ' ' + _appat + ' ' + apmat;
    this.cerrarModal.nativeElement.click();
    this.showModalClientes = false;
  }

  agregarClienteVehiculoInteres(_id:string){
    let valida:boolean = false;
    for(let i = 0 ; i<= this.listaClienteInteresado.length - 1 ; i++){
      if(this.listaClienteInteresado[i].id_cliente == _id)
      {
        valida = true;
        i = this.listaClienteInteresado.length - 1;
      }
    }

    if(valida == false)
    {
      Swal.fire({title: 'Guardando nuevos registros. . .', text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      let parametros = {
        "id_cliente": _id,
        "id_vehiculo": this.id_vehiculo,
        "nivel_interes": 1,
        "oferta": 2500,
        "detalle": 'detalle',
        "hr_latitud": '0',
        "hr_longitud": '0',
        "hr_dispositivo": localStorage.getItem("dispositivo"),
        "hr_id_usuario": localStorage.getItem("id_usuario")
      };
      this.http.post(this.url+"cliente/agregarClienteVehiculoInteres", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1){
              this.listaClienteInteresByIdVehiculo();
              this.cerrarModal.nativeElement.click();
              this.showModalClientesInteresado = false;
            }
          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
      });
    }
    else
    {
      Swal.fire("Error de validación", 'No se puede agregar el cliente ya que se encuentra en la lista. . .', "warning");
    }
  }

  recepcionById()
  {
    Swal.fire({title: 'Buscando recpciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_recepcion": this.id_recepcion,
    };
    
    this.http.post(this.url+"recepcion/recepcionById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          this.id_vehiculo = datos[0]["id_vehiculo"]

          this.usuario = datos[0]["usuario"]
          this.fecha = datos[0]["fecha"]
          this.hora = datos[0]["hora"]
          this.observacion_recepcion = datos[0]["observacion"]
          this.sucursal = datos[0]["nombre_sucursal"]
          this.propietario = datos[0]["nombre_propietario"]
          this.ci = datos[0]["ci_propietario"]
          this.direccion = datos[0]["direccion_propietario"]
          this.telefono = datos[0]["telefono_propietario"]
          this.venta = datos[0]["venta"]
          this.venta_estado = datos[0]["venta_estado"]

          let elemento:any = document.querySelector("#pdf_devolucion");
          elemento.style.display = 'block';
          elemento = document.querySelector("#pdf_venta");
          elemento.style.display = 'block';

          if(this.venta == "0"){
            let elemento:any = document.querySelector("#pdf_devolucion");
            elemento.style.display = 'none';
            elemento = document.querySelector("#pdf_venta");
            elemento.style.display = 'none';
          }

          if(this.venta == "1"){
            let elemento:any = document.querySelector("#pdf_devolucion");
            elemento.style.display = 'none';
            elemento = document.querySelector("#tab_venta");
            elemento.style.display = 'none';
            elemento = document.querySelector("#tab_devolucion");
            elemento.style.display = 'none';
          }

          if(this.venta == "2"){
            let elemento:any = document.querySelector("#pdf_venta");
            elemento.style.display = 'none';
            elemento = document.querySelector("#tab_venta");
            elemento.style.display = 'none';
            elemento = document.querySelector("#tab_devolucion");
            elemento.style.display = 'none';
          }

          this.vehiculoById();
          this.vehiculoAccesorioById();
          this.listaClienteInteresByIdVehiculo();
          this.listaEntradaSalidaParqueoByVehiculo();
          this.listaGastosByIdVehiculo();
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  vehiculoById(){
    Swal.fire({title: 'Buscando recpciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
    };
    this.http.post(this.url+"vehiculo/vehiculoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          this.vehiculo = datos[0]["nombre_clase_vehiculo"] + " " + datos[0]["nombre_marca"] + " " + datos[0]["tipo"] + " " + datos[0]["version"] + " " + datos[0]["anho"]
          this.pais = datos[0]["pais"]
          this.traccion = datos[0]["traccion"]
          this.color = datos[0]["color"]
          this.motor = datos[0]["motor"]
          this.caja = datos[0]["caja"]
          this.cilindrada = datos[0]["cilindrada"]
          this.nro_puerta = datos[0]["nro_puerta"]
          this.kilometraje = datos[0]["kilometraje"]
          this.placa = datos[0]["placa"]
          this.nro_copia = datos[0]["nro_copia"]
          this.precio_propietario = datos[0]["precio_propietario"]
          this.precio_venta = datos[0]["precio_sugerido"]
          this.observacion_vehiculo = datos[0]["observacion"]

          let imagenes = datos[0]['foto'].split(",");
          this.imagen_vehiculo = imagenes;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  vehiculoAccesorioById()
  {
    Swal.fire({title: 'Buscando recpciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
    };
    this.http.post(this.url+"vehiculo/vehiculoAccesorioById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.id_accesorio = datos[0]["id"]
          let imagenes = datos[0]['foto'].split(",");
          this.imagen_accesorio = imagenes;
          this.imagen_accesorio_simple = datos[0]['foto'];

          if(datos[0]['extinguidor'] == "1"){this.con_accesorios.push("Extinguidor"); this.extinguidor_accesorio=1;}else{this.sin_accesorios.push("Extinguidor");}
          if(datos[0]['estuche_herramientas'] == "1"){this.con_accesorios.push("Estuche Herramienta"); this.estuche_herramienta_accesorio = 1;}else{this.sin_accesorios.push("Estuche Herramienta");}
          if(datos[0]['fundas'] == "1"){this.con_accesorios.push("Fundas"); this.fundas_accesorio = 1;}else{this.sin_accesorios.push("Fundas");}
          if(datos[0]['cabezales'] == "1"){this.con_accesorios.push("Cabezales"); this.cabezales_accesorio = 1;}else{this.sin_accesorios.push("Cabezales");}
          if(datos[0]['sobrepiso'] == "1"){this.con_accesorios.push("Sobre piso"); this.sobrepiso_accesorio = 1;}else{this.sin_accesorios.push("Sobre piso");}
          if(datos[0]['quitasol'] == "1"){this.con_accesorios.push("Quita sol"); this.quitasol_accesorio = 1;}else{this.sin_accesorios.push("Quita sol");}
          if(datos[0]['ceniceros'] == "1"){this.con_accesorios.push("Ceniceros"); this.ceniceros_accesorio = 1;}else{this.sin_accesorios.push("Ceniceros");}
          if(datos[0]['encendedor'] == "1"){this.con_accesorios.push("Encendedor"); this.encendedor_accesorio = 1;}else{this.sin_accesorios.push("Encendedor");}
          if(datos[0]['manual'] == "1"){this.con_accesorios.push("Manual"); this.manual_accesorio = 1;}else{this.sin_accesorios.push("Manual");}
          if(datos[0]['radio'] == "1"){this.con_accesorios.push("Radio"); this.radio_accesorio = 1;}else{this.sin_accesorios.push("Radio");}
          if(datos[0]['mataburro'] == "1"){this.con_accesorios.push("Mata Burro"); this.mataburro_accesorio = 1;}else{this.sin_accesorios.push("Mata Burro");}
          if(datos[0]['halogenos'] == "1"){this.con_accesorios.push("Halogenos"); this.halogenos_accesorio = 1;}else{this.sin_accesorios.push("Halogenos");}
          if(datos[0]['limpia_parabrisas'] == "1"){this.con_accesorios.push("Limpia Parabrisas"); this.limpia_parabrisas_accesorio = 1;}else{this.sin_accesorios.push("Limpia Parabrisas");}
          if(datos[0]['antena'] == "1"){this.con_accesorios.push("Antena"); this.antena_accesorio = 1;}else{this.sin_accesorios.push("Antena");}
          if(datos[0]['espejos'] == "1"){this.con_accesorios.push("Espejos"); this.espejos_accesorio = 1;}else{this.sin_accesorios.push("Espejos");}
          if(datos[0]['tapacubos'] == "1"){this.con_accesorios.push("Tapa Cubos"); this.tapacubos_accesorio = 1;}else{this.sin_accesorios.push("Tapa Cubos");}
          if(datos[0]['emblemas'] == "1"){this.con_accesorios.push("Emblemas"); this.emblemas_accesorio = 1;}else{this.sin_accesorios.push("Emblemas");}
          if(datos[0]['stoat'] == "1"){this.con_accesorios.push("Soat (Sticker)"); this.soat_accesorio = 1;}else{this.sin_accesorios.push("Soat (Sticker)");}
          if(datos[0]['inspeccion'] == "1"){this.con_accesorios.push("Inspeccion (Sticker)"); this.inspeccion_accesorio = 1;}else{this.sin_accesorios.push("Inspeccion (Sticker)");}
          if(datos[0]['alarma'] == "1"){this.con_accesorios.push("Alarma"); this.alarma_accesorio = 1;}else{this.sin_accesorios.push("Alarma");}
          if(datos[0]['tapa_tanque'] == "1"){this.con_accesorios.push("Tapa Tanque"); this.tapa_tanque_accesorio = 1;}else{this.sin_accesorios.push("Tapa Tanque");}
          if(datos[0]['gata'] == "1"){this.con_accesorios.push("Gata"); this.gata_accesorio = 1;}else{this.sin_accesorios.push("Gata");}
          if(datos[0]['manivela'] == "1"){this.con_accesorios.push("Manivela"); this.manivela_accesorio = 1;}else{this.sin_accesorios.push("Manivela");}
          if(datos[0]['llave_rueda'] == "1"){this.con_accesorios.push("Llave de Rueda"); this.llave_rueda_accesorio = 1;}else{this.sin_accesorios.push("Llave de Rueda");}
          if(datos[0]['dado_seguridad'] == "1"){this.con_accesorios.push("Dado de Seguridad"); this.dado_seguridad_accesorio = 1;}else{this.sin_accesorios.push("Dado de Seguridad");}
          if(datos[0]['triangulo'] == "1"){this.con_accesorios.push("Triangulo"); this.triangulo_accesorio = 1;}else{this.sin_accesorios.push("Triangulo");}
          if(datos[0]['botiquin'] == "1"){this.con_accesorios.push("Botiquin"); this.botiquin_accesorio = 1;}else{this.sin_accesorios.push("Botiquin");}
          if(datos[0]['llanta_auxilio'] == "1"){this.con_accesorios.push("Llanta de Auxilio"); this.llanta_auxilio_accesorio = 1;}else{this.sin_accesorios.push("Llanta de Auxilio");}

          this.detalle_pintura_accesorio = datos[0].detalle_pintura;
          this.estado_llanta_accesorio = datos[0].estado_llanta;
          this.nro_bateria_accesorio = datos[0].nro_bateria;
          this.gasolina_accesorio = datos[0].gasolina;
          this.observacion_accesorio = datos[0].observacion;

        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaEntradaSalidaParqueoByVehiculo(){
    Swal.fire({title: 'Buscando movimientos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo
    };

    this.http.post(this.url+"parqueo/listaEntradaSalidaParqueoByVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaParqueoVehiculo = datos;
          if(this.listaParqueoVehiculo[0]["entrada_salida"] == "0"){
            this.titulo_ultimoParqueo = "Ultimo Parqueo";
          }
          this.ultimoParqueo = this.listaParqueoVehiculo[0]["nombre_parqueo"]
          this.id_parqueo = this.listaParqueoVehiculo[0]["id_parqueo"]
          this.id_parqueo_vehiculo = this.listaParqueoVehiculo[0]["id_parqueo_vehiculo"]
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaGastosByIdVehiculo(){
    Swal.fire({title: 'Buscando movimientos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
      "estado": "1"
    };

    this.http.post(this.url+"vehiculo/listaGastosByIdVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaGastos = datos;
          this.totalGasto = 0.00;
          for(let i=0;i<this.listaGastos.length;i++){
            this.totalGasto = parseFloat(this.totalGasto) + parseFloat(this.listaGastos[i]["subtotal"])
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaClienteInteresByIdVehiculo(){
    Swal.fire({title: 'Buscando recpciones',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_vehiculo": this.id_vehiculo,
      "estado": 1
    };
    this.http.post(this.url+"cliente/listaClienteInteresByIdVehiculo", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaClienteInteresado = datos;
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  calcularTotal(){
    this.subTotal10 = 10 * parseInt(this.corte10);
    this.subTotal20 = 20 * parseInt(this.corte20);
    this.subTotal50 = 50 * parseInt(this.corte50);
    this.subTotal100 = 100 * parseInt(this.corte100);
    this.subTotal200 = 200 * parseInt(this.corte200);
    
    this.subTotalDolar1 = 1 * parseInt(this.corteDolar1);
    this.subTotalDolar2 = 2 * parseInt(this.corteDolar2);
    this.subTotalDolar5 = 5 * parseInt(this.corteDolar5);
    this.subTotalDolar10 = 10 * parseInt(this.corteDolar10);
    this.subTotalDolar20 = 20 * parseInt(this.corteDolar20);
    this.subTotalDolar50 = 50 * parseInt(this.corteDolar50);
    this.subTotalDolar100 = 100 * parseInt(this.corteDolar100);

    this.subTotalBolivianos = parseInt(this.subTotal10) + parseInt(this.subTotal20) + parseInt(this.subTotal50) + parseInt(this.subTotal100) + parseInt(this.subTotal200)
    this.subTotalDolares = parseInt(this.subTotalDolar1) + parseInt(this.subTotalDolar2) + parseInt(this.subTotalDolar5) + parseInt(this.subTotalDolar10) + parseInt(this.subTotalDolar20) + parseInt(this.subTotalDolar50) + parseInt(this.subTotalDolar100)
  }

  agregarVenta(){
    if(this.glosa != "" || this.glosa != null)
    {
      if(this.monto != "")
      {
        if(this.moneda != "")
        {
          if(this.nombre_origen != "")
          {
            if(this.cuenta_origen != "")
            {
              if(this.banco_origen != "")
              {
                if(this.cuenta_destino != "")
                {
                  if(this.banco_destino != "")
                  {
                    if(this.id_cliente_seleccionado != "")
                    {
                      Swal.fire({title: 'Guardando registro de venta. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
                      let parametros = {
                        "importacion_local": 1, 
                        "id_recepcion": this.id_recepcion,
                        "id_sucursal": this.id_sucursal,
                        "id_vehiculo": this.id_vehiculo,
                        "precio": this.monto,
                        "id_cliente": this.id_cliente_seleccionado,
                        "id_usuario": localStorage.getItem("id_usuario"),
                        "observacion": this.glosa,
                        "hr_latitud": '0',
                        "hr_longitud":'0',
                        "hr_dispositivo": localStorage.getItem('dispositivo'),
                        "nombre_propietario": this.propietario
                      };
                      this.http.post(this.url+"venta/agregarVenta", parametros).subscribe((datos_recibidos:any) => {
                        Swal.close();
  
                        let datos = datos_recibidos["datos"];
                        let datosMysql = datos_recibidos["mysql"];
                        let datosNodejs = datos_recibidos["nodejs"];
                        if(datosMysql === undefined){
                          if(datosNodejs === undefined){
                            if(datos.affectedRows == 1)
                            {
                              this.agregarVentaPago(datos.id_venta);
                            }
                          }else{
                            Swal.fire("Error en el Servidor", datosNodejs, "warning");
                          }
                        }else{
                          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
                        }
                      });
                    }
                    else
                    {
                      Swal.fire("Error en la validación de datos.", 'Debe seleccionar un cliente. . .', "warning");  
                    }
                  }
                  else
                  {
                    Swal.fire("Error en la validación de datos.", 'Debe agregar el nombre de banco de destino. . .', "warning");
                  }
                }
                else
                {
                  Swal.fire("Error en la validación de datos.", 'Debe llenar el campo de cuenta de destino. . .', "warning");
                }
              }
              else
              {
                Swal.fire("Error en la validación de datos.", 'Debe rrellenar el campo banco de origen. . .', "warning");
              }
            }
            else
            {
              Swal.fire("Error en la validación de datos.", 'Debe rrellenar el campo cuenta de origen. . .', "warning");
            }
          }
          else
          {
            Swal.fire("Error en la validación de datos.", 'Debe rrellenar el campo nombre de origen. . .', "warning");
          }
        }
        else
        {
          Swal.fire("Error en la validación de datos.", 'Debe seleccionar la moneda. . .', "warning");
        }
      }
      else
      {
        Swal.fire("Error en la validación de datos.", 'El Campo monto no puede estar vacío. . .', "warning");
      }
    }
    else
    {
      Swal.fire("Error en la validación de datos.", 'Debe llenar el campo glosa. . .', "warning");
    }
  }

  agregarVentaPago(_id:string){
    
    Swal.fire({title: 'Guardando registro de venta pago. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_venta": _id, 
      "id_usuario": localStorage.getItem("id_usuario"),
      "corte_boliviano_10": this.corte10,
      "corte_boliviano_20": this.corte20,
      "corte_boliviano_50": this.corte50,
      "corte_boliviano_100": this.corte100,
      "corte_boliviano_200": this.corte200,
      "corte_dolar_1": this.corteDolar1,
      "corte_dolar_2": this.corteDolar2,
      "corte_dolar_5": this.corteDolar5,
      "corte_dolar_10": this.corteDolar10,
      "corte_dolar_20": this.corteDolar20,
      "corte_dolar_50": this.corteDolar50,
      "corte_dolar_100": this.corteDolar100,
      "glosa": this.glosa,
      "monto": this.monto,
      "moneda": this.moneda,
      "nombre_origen": this.nombre_origen,
      "cuenta_origen": this.cuenta_origen,
      "banco_origen": this.banco_origen,
      "cuenta_destino": this.cuenta_destino,
      "banco_destino": this.banco_origen,
      "verificado": 0,
      "id_usuario_verificado": localStorage.getItem('id_usuario'),
      "hr_latitud": '0',
      "hr_longitud": '0',
      "hr_dispositivo": localStorage.getItem('dispositivo'),
    };
    this.http.post(this.url+"venta/agregarVentaPago", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            alert('exitos')
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  agregarDevolucion(){
    Swal.fire({title: 'Generando Devolucion',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "id_recepcion": this.id_recepcion, 
      "id_sucursal": this.id_sucursal,
      "id_usuario": localStorage.getItem("id_usuario"),
      "id_vehiculo": this.id_vehiculo,
      "nombre_propietario": this.propietario,
      "ci_propietario": this.ci,
      "direccion_propietario": this.direccion,
      "telefono_propietario": this.telefono,
      "observacion": this.observacion_devolucion,
      "hr_latitud":'0',
      "hr_longitud": '0',
      "hr_dispositivo": localStorage.getItem('dispositivo')
    };
    this.http.post(this.url+"devolucion/agregarDevolucion", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.observacion_devolucion = '';
            this.agregarDevolucionAccesorio();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  agregarDevolucionAccesorio(){
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
      'foto': this.imagen_accesorio_simple,
      'hr_id_usuario': localStorage.getItem("id_usuario"),
      'hr_dispositivo': localStorage.getItem("dispositivo"),
      'hr_latitud': '0',
      'hr_longitud': '0'
    };

    Swal.fire({title: 'Devolviendo Accesorios',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "vehiculo/agregarDevolucionAccesorio", parametros).subscribe((datos_recibidos:any) => 
    {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.actualizarParqueoVehiculoToSalida();
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

  actualizarParqueoVehiculoToSalida(){
    let parametros = {
      'id_parqueo_vehiculo': this.id_parqueo_vehiculo,
      'id_parqueo': this.id_parqueo,
      'id_sucursal': this.id_sucursal,
      'id_vehiculo': this.id_vehiculo,
      'observacion_salida': "Devolucion de vehiculo",
      'id_usuario_salida': localStorage.getItem("id_usuario"),
      'hr_dispositivo': localStorage.getItem("dispositivo"),
      'hr_latitud': '0',
      'hr_longitud': '0'
    };

    Swal.fire({title: 'Saliendo de Parqueo',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "parqueo/actualizarParqueoVehiculoToSalida", parametros).subscribe((datos_recibidos:any) => 
    {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          if(datos.affectedRows == 1)
          {
            this.recepcionById();
            this.tabDocumentos.nativeElement.click();
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

  reporteRecepcionById(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    
    const params = new HttpParams({
      fromObject: {
      "id_recepcion": this.id_recepcion,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"recepcion/reporteRecepcionById", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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

  reporteListaGastosByIdVehiculo(){
    Swal.fire({title: 'Generando reporte PDF',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    const params = new HttpParams({
      fromObject: {
      "id_vehiculo": this.id_vehiculo,
      "estado": 1,
      "id_sucursal": this.id_sucursal,
      "id_usuario_impresion": localStorage.getItem("id_usuario")  || ""
      }
      });
    let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'});
    this.http.post(this.url+"vehiculo/reporteListaGastosByIdVehiculo", params, {responseType: 'arraybuffer',headers:headers}).subscribe((datos_recibidos:any) => {
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
