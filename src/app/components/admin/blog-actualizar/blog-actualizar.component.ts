import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { globals } from 'src/app/utils/global';
import Swal from 'sweetalert2';
import { decryptNumber } from 'src/app/utils/encrypt';

@Component({
  selector: 'app-blog-actualizar',
  templateUrl: './blog-actualizar.component.html',
  styleUrls: ['./blog-actualizar.component.css']
})
export class BlogActualizarComponent implements OnInit {

  url:string = globals.url;

  id_blog:string = '';
  titulo:string = '';
  contenido:string='';
  link:string='';
  imagenes_blog:any;

  blogHabilitado:boolean = false;

  filesblog:any = [];
  countBlogimg:number = 0;

  constructor(private location: Location, private http:HttpClient, private router:Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    if(localStorage.getItem("Blog") != undefined){
      
      this.id_blog = decryptNumber(this.route.snapshot.paramMap.get("id_blog"));

      setTimeout(()=>{
        this.blogById();
      }, 150);
    }else{
      this.router.navigate(['/restriccion']);
    }
  }

  onSelectAccesorio(event:any) {
    console.log(event);
    this.filesblog.push(...event.addedFiles);
  }

  onRemoveAccesorio(event:any) {
    console.log(event);
    this.filesblog.splice(this.filesblog.indexOf(event), 1);
  }

  clickNavegarHaciaLista(){
    this.location.back();
  }

  actualizarEstadoBlogById(_estado:number){

    Swal.fire({title: 'Actualizando estado',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      let parametros = {
        "estado": _estado,
        "id": this.id_blog,
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_dispositivo': localStorage.getItem("dispositivo"),
        'hr_latitud': '0',
        'hr_longitud': '0'
      };

      this.http.post(this.url+"blog/actualizarEstadoBlogById", parametros).subscribe((datos_recibidos:any) => {
        Swal.close();
  
        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){

            if(datos.affectedRows == 1)
            {
              this.blogById();
            }

          }else{
            Swal.fire("Error en el Servidor", datosNodejs, "warning");
          }
        }else{
          Swal.fire("Error en la Base de Datos", datosMysql, "warning");
        }
  
      });

  }

  eliminarImagenById(_img:string){
    let parametros = {
      "imagen": _img, 
      "id": this.id_blog
    };

    Swal.fire({title: 'Actualizando imagenes. . .',text: 'Aguarde unos segundos . . .', allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "blog/eliminarImagenById", parametros).subscribe((datos_recibidos:any) => {
      
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          
          if(datos.affectedRows == 1){
            this.blogById();
          }
        }else{
          Swal.fire("Error en el Servidor", datosNodejs, "warning");
        }
      }else{
        Swal.fire("Error en la Base de Datos", datosMysql, "warning");
      }
    });
  }

  actualizarBlogById(){
    if(this.titulo == "")
    {
      Swal.fire("Error en validación de datos. . .", "El campo Titulo no puede estar vacío este es obligatorio, intente nuevamente. . .", "warning");
    }else if(this.contenido == "")
    {
      Swal.fire("Error en validación de datos. . .", "El campo descripción de contenido no puede estar vacío, intente nuevamente. . .", "warning");
    }
    else
    {
      let parametros = {
        
        'titulo': this.titulo,
        'contenido': this.contenido,
        'link': this.link,
        'id': this.id_blog,
        'hr_id_usuario': localStorage.getItem("id_usuario"),
        'hr_latitud': '0',
        'hr_longitud': '0',
        'hr_dispositivo': localStorage.getItem("dispositivo")
      };
  
      Swal.fire({title: 'Actualizando datos. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "blog/actualizarBlogById", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              if(this.filesblog.length > 0){
                this.agregarImagenBlog()
              }

              this.clickNavegarHaciaLista();
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

  blogById(){
    let parametros = {
      'id_blog': this.id_blog
    };

    Swal.fire({title: 'Cargando registros. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

    this.http.post(this.url + "blog/blogById", parametros).subscribe((datos_recibidos:any) => 
    {
      Swal.close();

      let datos = datos_recibidos["datos"];
      let datosMysql = datos_recibidos["mysql"];
      let datosNodejs = datos_recibidos["nodejs"];
      if(datosMysql === undefined){
        if(datosNodejs === undefined){
          this.titulo = datos[0].titulo;
          this.contenido = datos[0].contenido;
          this.link = datos[0].imagen;
          //this.imagenes_blog = datos[0].imagen.split(",");
          this.blogHabilitado = datos[0].estado=='1'?true:false;
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

  agregarImagenBlog(){
    if(this.filesblog.length > this.countBlogimg ) {
      Swal.fire({title: 'Agregando imagen ' + (this.countBlogimg+1) + "/" + this.filesblog.length,text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});
      const formData: FormData = new FormData();
      formData.append('imagen', this.filesblog[this.countBlogimg]);
      
      this.http.post(this.url+"blog/agregarImagenBlog/" + this.id_blog, formData).subscribe((datos_recibidos:any) => {
        Swal.close();
        this.countBlogimg = this.countBlogimg + 1;  
        this.agregarImagenBlog()
      });
    }else{
      this.filesblog = [];
    }
  }


}
