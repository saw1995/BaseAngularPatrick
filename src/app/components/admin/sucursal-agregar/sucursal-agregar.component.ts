import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-sucursal-agregar',
  templateUrl: './sucursal-agregar.component.html',
  styleUrls: ['./sucursal-agregar.component.css']
})
export class SucursalAgregarComponent implements OnInit, AfterViewInit {
  map:any;
  @ViewChild('mapElement') mapElement: any;
  url:string = "";

  swDepartamento:boolean = true;

  listaSucursal:any;

  nombre_sucursal:string = '';
  sitioweb_sucursal:string = '';
  telefono_uno_sucursal:string = '';
  telefono_dos_sucursal:string = '';
  telefono_tres_sucursal:string = '';

  zona_sucursal:string = '';
  avenida_sucursal:string = '';
  calle_sucursal:string = '';
  numero_casa_sucursal:string = '';
  referencia_sucursal:string = '';
  latitud_sucursal:string = '';
  longitud_sucursal:string = '';

  datosDepartamento: any;
  datosProvincia: any;
  datosMunicipio: any;

  departamento:string = '';
  provincia:string = '';
  id_municipio:string = '';


  files: File[] = [];

  labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  labelIndex = 0;
  markersArray:any = [];

  constructor(private http:HttpClient, private route:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("Sucursales") != undefined){
      this.url = globals.url;  
    }else{
      this.route.navigate(['/restriccion']);
    }
  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      center: {lat: -16.540246638894946, lng: -64.79782730340958},
      zoom: 5
    });
    google.maps.event.addListener(this.map, "click", (event:any) => {
      this.addMarker(event.latLng, this.map);
    });
  }

  addMarker(location:any, map:any) {
    if(this.markersArray.length > 0){
      this.markersArray[0].setMap(null);
    }
    
    this.markersArray[0] = new google.maps.Marker({
      position: location,
      label: this.labels[this.labelIndex++ % this.labels.length],
    });
    
    this.markersArray[0].setMap(map);
    this.latitud_sucursal = this.markersArray[0]["position"].lat().toFixed(6)
    this.longitud_sucursal = this.markersArray[0]["position"].lng().toFixed(6)
  }
  
  onSelect(event:any) {
    console.log(event);
    if(this.files && this.files.length >=1) {
      this.onRemove(this.files[0]);
    }
    this.files.push(...event.addedFiles);
  }

  onRemove(event:any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  clickNavegarHaciaSucursales(){
    this.route.navigate(['sucursal']);
  }

  agregarSucursal(){
    Swal.fire({title: 'Agregando Sucursal',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
  
    if(this.nombre_sucursal == "")
    {
      Swal.fire("Campo Vacio", "Debe agregar el nombre de la sucursal dato obligatorio, intente nuevamente.", "warning");
    }
    else if(this.telefono_uno_sucursal == '')  
    {
      Swal.fire("Campo Vacio", "Debe agregar al menos un numero de telefono, agregue al menos agregue un identificador", "warning");
    }
    else
    {
      let parametros = {
        'nombre': this.nombre_sucursal,
        'sitio_web': this.sitioweb_sucursal,
        'departamento': this.departamento,
        'zona': this.zona_sucursal,
        'avenida': this.avenida_sucursal,
        'calle': this.calle_sucursal,
        'numero': this.numero_casa_sucursal,
        'referencia': this.referencia_sucursal,
        'latitud': this.latitud_sucursal,
        'longitud': this.longitud_sucursal,
        'telefono_uno': this.telefono_uno_sucursal,
        'telefono_dos': this.telefono_dos_sucursal,
        'foto': 'sin_imagen_sucursal.jpg',
        'id_rol': localStorage.getItem("id_rol"),
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': 0,
        'hr_longitud': 0
      };
  
      this.http.post(this.url + "sucursal/agregarSucursal", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
        
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
  
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {              
              
              if(this.files.length > 0)
              {
                this.actualizarImagenById(datos.id_sucursal);
              }              

              this.clickNavegarHaciaSucursales();
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

  actualizarImagenById(_idSucursal:string){
    
    const formData: FormData = new FormData();
    formData.append('imagen', this.files[0]);
    this.http.post(
    this.url + "sucursal/actualizarImagenById/" + _idSucursal,
    formData).subscribe((response:any) => {
      console.log("termino:" + response)
    });
  }
}
