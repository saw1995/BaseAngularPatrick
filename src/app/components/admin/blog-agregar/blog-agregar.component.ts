import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { globals } from 'src/app/utils/global';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-agregar',
  templateUrl: './blog-agregar.component.html',
  styleUrls: ['./blog-agregar.component.css']
})
export class BlogAgregarComponent implements OnInit {

  url:string = globals.url;

  id_blog:string = '';
  titulo:string = '';
  contenido:string='';
  link:string='';

  filesblog:any = [];
  countBlogimg:number = 0;

  constructor(private location: Location, private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("Blog") != undefined){
      
      setTimeout(()=>{
        //empezamos inicioams
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

  agregarBlog(){
    if(this.titulo == "")
    {
      Swal.fire("Error en validación de datos. . .", "El campo Titulo no puede estar vacío este es obligatorio, intente nuevamente. . .", "warning");
    }else if(this.contenido == "")
    {
      Swal.fire("Error en validación de datos. . .", "El campo descripción de contenido no puede estar vacío, intente nuevamente. . .", "warning");
    }
    else if(this.link == "")
    {
      Swal.fire("Error en validación de datos. . .", "El campo link de video no puede estar vacío, intente nuevamente. . .", "warning");
    }
    else
    {
      let parametros = {
        'id_usuario': localStorage.getItem("id_usuario"),
        'titulo': this.titulo,
        'contenido': this.contenido,
        'link': this.link,
        'vistas':0,
        'hr_latitud': '0',
        'hr_longitud': '0',
        'hr_dispositivo': localStorage.getItem("dispositivo")
      };
  
      Swal.fire({title: 'Creando contenido. . .',text: 'Aguarde unos segundos . . .',allowOutsideClick: false,willOpen: () => {Swal.showLoading()}});

      this.http.post(this.url + "blog/agregarBlog", parametros).subscribe((datos_recibidos:any) => 
      {
        Swal.close();

        let datos = datos_recibidos["datos"];
        let datosMysql = datos_recibidos["mysql"];
        let datosNodejs = datos_recibidos["nodejs"];
        if(datosMysql === undefined){
          if(datosNodejs === undefined){
            if(datos.affectedRows == 1)
            {
              this.id_blog = datos.id_blog;

              if(this.filesblog.length > 0){
                //this.agregarImagenBlog()
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
