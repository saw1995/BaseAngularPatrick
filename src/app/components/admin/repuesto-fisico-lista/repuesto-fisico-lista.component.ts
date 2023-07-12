import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { decryptNumber, encryptNumber } from '../../../utils/encrypt';
import { globals } from '../../../utils/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-repuesto-fisico-lista',
  templateUrl: './repuesto-fisico-lista.component.html',
  styleUrls: ['./repuesto-fisico-lista.component.css']
})
export class RepuestoFisicoListaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cerrarModalRepuesto') cerrarModalRepuesto:any = ElementRef;
  @ViewChild('cerrarModalRepuestoSalida') cerrarModalRepuestoSalida:any = ElementRef;
  @ViewChild('cerrarModalRepuestoDetalle') cerrarModalRepuestoDetalle:any = ElementRef;
  @ViewChild('cerrarModal') cerrarModal:any = ElementRef;
  url:string = globals.url;
  
  @ViewChild(DataTableDirective, {static: false})
  dtElement:any = DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  showModalRepuesto:boolean = false;
  showModalRepuestoSalida:boolean = false;
  showModalRepuestoDetalle:boolean = false;
  showModalAgregarMarca:boolean = false;
  showModalAgregarClase:boolean = false;

  id_marca:any = "";
  nombre_marca:any = ""
  descripcion_marca:any = "";

  id_clase:any = "";
  nombre_clase:any = ""
  descripcion_clase:any = "";

  id_respuesto_fisico:string = '';
  id_taller:string = '';

  tipo_vehiculo:any = "";
  version_vehiculo:any = "";
  anho_vehiculo:any = "";
  nombre_repuesto:any = "";
  costo_repuesto:any = "";

  nombre_repuesto_salida:any = "";
  tipo_salida:any = "";
  detalle_salida:any = "";

  repuesto:any;
  listaRepuesto:any[] = [];
  listaTaller:any[] = [];
  listaMarca:any[] = [];
  listaClase:any[] = [];

  constructor(private http: HttpClient, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(localStorage.getItem("Configuracion") != undefined){
      this.url = globals.url;  

      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 50,
        lengthMenu : [50, 100, 200],
        processing: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json"
        }
      };

      setTimeout(()=>{
        this.listaRepuestoFisico();
      }, 500)
      
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

  click_agregarSalida(id:any, nombre:any){
    this.showModalRepuestoSalida = true;

    this.id_respuesto_fisico = id;
    this.nombre_repuesto_salida = nombre;
  }

  click_detalleRepuesto(id:any){
    this.showModalRepuestoDetalle = true;

    this.id_respuesto_fisico = id;
    this.repuestoFisicoById()
  }

  click_agregarRepuesto(){
    this.showModalRepuesto = true;

    this.listaTalleresByEstado()
    this.listaMarcaByEstado()
    this.listaClaseVehiculoByEstado();
  }

  click_agregarMarca(){
    this.showModalAgregarMarca = true;
  }

  click_agregarClase(){
    this.showModalAgregarClase = true;
  }

  agregarRepuestoFisico()
  {
    Swal.fire({
      title: '¿Esta seguro de agregar al Inventario?',
      html: "<b>Repuesto:</b>" + this.nombre_repuesto
          + "</br> <b>Costo: </b> $us. " + this.costo_repuesto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Agregar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Proceso',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'id_marca': this.id_marca,
          'id_clase_vehiculo': this.id_clase,
          'tipo': this.tipo_vehiculo,
          'version': this.version_vehiculo,
          'anho': this.anho_vehiculo,
          'nombre': this.nombre_repuesto,
          'cantidad': "1",
          'costo': this.costo_repuesto,
          'id_taller': this.id_taller,
          'id_usuario': localStorage.getItem("id_usuario")
        };
        this.http.post(this.url+"repuesto/agregarRepuestoFisico", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaRepuestoFisico();

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

  actualizarSalidaRepuestoFisicoById()
  {
    Swal.fire({
      title: '¿Esta seguro de registrar la salida del Inventario?',
      html: "<b>Repuesto:</b>" + this.nombre_repuesto_salida
          + "</br> <b>Detalle: </b> $us. " + this.detalle_salida,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({title: 'Agregando Salida',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
        let parametros = {
          'cantidad': "0",
          'salida': this.tipo_salida,
          'detalle': this.detalle_salida,
          'id': this.id_respuesto_fisico,
          'id_usuario_salida': localStorage.getItem("id_usuario")
        };
        this.http.post(this.url+"repuesto/actualizarSalidaRepuestoFisicoById", parametros).subscribe((datos_recibidos:any) => {
          Swal.close();

          let datos = datos_recibidos["datos"];
          let datosMysql = datos_recibidos["mysql"];
          let datosNodejs = datos_recibidos["nodejs"];
          if(datosMysql === undefined){
            if(datosNodejs === undefined){
              this.listaRepuestoFisico();

              this.cerrarModalRepuestoSalida.nativeElement.click();
              this.showModalRepuestoSalida = false;
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

  repuestoFisicoById()
  {
    Swal.fire({title: 'Buscando Repuestos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'id_repuesto_fisico': this.id_respuesto_fisico,
    };
    this.http.post(this.url+"repuesto/repuestoFisicoById", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.repuesto = datos[0];
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  listaRepuestoFisico()
  {
    Swal.fire({title: 'Buscando Repuestos',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      'estado': "1",
    };
    this.http.post(this.url+"repuesto/listaRepuestoFisico", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.listaRepuesto = datos;

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
  
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 50,
              lengthMenu : [50, 100, 200],
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

  listaTalleresByEstado(){
    Swal.fire({title: 'Buscando Taller',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
    let parametros = {
      "estado": "1"
    };

    this.http.post(this.url+"taller/listaTalleresByEstado", parametros).subscribe((datos_recibidos:any) => {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){

          this.listaTaller = datos;

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
