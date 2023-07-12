import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from '../components/admin/admin.component';
import { IncHeaderComponent } from '../components/admin/inc-header/inc-header.component';
import { IncFooterComponent } from '../components/admin/inc-footer/inc-footer.component';
import { IncSiderbarComponent } from '../components/admin/inc-siderbar/inc-siderbar.component';
import { UsuarioListaComponent } from '../components/admin/usuario-lista/usuario-lista.component';
import { UsuarioAgregarComponent } from '../components/admin/usuario-agregar/usuario-agregar.component';
import { ParqueoListaComponent } from '../components/admin/parqueo-lista/parqueo-lista.component';
import { ParqueoModuloComponent } from '../components/admin/parqueo-modulo/parqueo-modulo.component';
import { ParqueoPanelComponent } from '../components/admin/parqueo-panel/parqueo-panel.component';
import { ParqueoVehiculoListaComponent } from '../components/admin/parqueo-vehiculo-lista/parqueo-vehiculo-lista.component';
import { PanelcontrolComponent } from '../components/admin/panelcontrol/panelcontrol.component';
import { UsuarioPerfilComponent } from '../components/admin/usuario-perfil/usuario-perfil.component';
import { UsuarioEditarComponent } from '../components/admin/usuario-editar/usuario-editar.component';
import { SucursalListaComponent } from '../components/admin/sucursal-lista/sucursal-lista.component';
import { SucursalPanelComponent } from '../components/admin/sucursal-panel/sucursal-panel.component';
import { SucursalModuloComponent } from '../components/admin/sucursal-modulo/sucursal-modulo.component';
import { SucursalAgregarComponent } from '../components/admin/sucursal-agregar/sucursal-agregar.component';
import { SucursalActualizarComponent } from '../components/admin/sucursal-actualizar/sucursal-actualizar.component';
import { RecepcionListaComponent } from '../components/admin/recepcion-lista/recepcion-lista.component';
import { RecepcionAgregarComponent } from '../components/admin/recepcion-agregar/recepcion-agregar.component';
import { RecepcionDetalleComponent } from '../components/admin/recepcion-detalle/recepcion-detalle.component';
import { DevolucionListaComponent } from '../components/admin/devolucion-lista/devolucion-lista.component';
import { VentaListaComponent } from '../components/admin/venta-lista/venta-lista.component';
import { ClienteListaComponent } from '../components/admin/cliente-lista/cliente-lista.component';
import { ClienteAgregarComponent } from '../components/admin/cliente-agregar/cliente-agregar.component';
import { ClienteEditarComponent } from '../components/admin/cliente-editar/cliente-editar.component';
import { ClientePerfilComponent } from '../components/admin/cliente-perfil/cliente-perfil.component';
import { CargoListaComponent } from '../components/admin/cargo-lista/cargo-lista.component';
import { NotificacionListaComponent } from '../components/admin/notificacion-lista/notificacion-lista.component';
import { VerificacionPagoListaComponent } from '../components/admin/verificacion-pago-lista/verificacion-pago-lista.component';
import { GastoListaComponent } from '../components/admin/gasto-lista/gasto-lista.component';
import { ParqueoSalidasComponent } from '../components/admin/parqueo-salidas/parqueo-salidas.component';
import { ParqueoEntradasComponent } from '../components/admin/parqueo-entradas/parqueo-entradas.component';
import { TallerListaComponent } from '../components/admin/taller-lista/taller-lista.component';
import { ImportacionListaComponent } from '../components/admin/importacion-lista/importacion-lista.component';
import { ImportacionAgregarComponent } from '../components/admin/importacion-agregar/importacion-agregar.component';
import { ImportacionDetalleComponent } from '../components/admin/importacion-detalle/importacion-detalle.component';
import { TallerModuloComponent } from '../components/admin/taller-modulo/taller-modulo.component';
import { TallerVehiculoListaComponent } from '../components/admin/taller-vehiculo-lista/taller-vehiculo-lista.component';
import { TallerRecepcionImportacionComponent } from '../components/admin/taller-recepcion-importacion/taller-recepcion-importacion.component';
import { TallerRecepcionAgregarComponent } from '../components/admin/taller-recepcion-agregar/taller-recepcion-agregar.component';
import { VehiculoListaComponent } from '../components/admin/vehiculo-lista/vehiculo-lista.component';
import { BlogListaComponent } from '../components/admin/blog-lista/blog-lista.component';
import { BlogAgregarComponent } from '../components/admin/blog-agregar/blog-agregar.component';
import { BlogActualizarComponent } from '../components/admin/blog-actualizar/blog-actualizar.component';
import { VehiculoAgregarExhibicionComponent } from '../components/admin/vehiculo-agregar-exhibicion/vehiculo-agregar-exhibicion.component';
import { SucursalContratoGarantiaComponent } from '../components/admin/sucursal-contrato-garantia/sucursal-contrato-garantia.component';
import { SucursalReciboPagoComponent } from '../components/admin/sucursal-recibo-pago/sucursal-recibo-pago.component';
import { SucursalDevolucionPagoComponent } from '../components/admin/sucursal-devolucion-pago/sucursal-devolucion-pago.component';
import { ContratoEditarComponent } from '../components/admin/contrato-editar/contrato-editar.component';
import { AdendaEditarComponent } from '../components/admin/adenda-editar/adenda-editar.component';
import { ClienteContratoEditarComponent } from '../components/admin/cliente-contrato-editar/cliente-contrato-editar.component';
import { ClienteAdendaEditarComponent } from '../components/admin/cliente-adenda-editar/cliente-adenda-editar.component';
import { ProcesoListaComponent } from '../components/admin/proceso-lista/proceso-lista.component';
import { ProcesoModeloComponent } from '../components/admin/proceso-modelo/proceso-modelo.component';
import { CotizacionListaComponent } from '../components/admin/cotizacion-lista/cotizacion-lista.component';
import { CotizacionDetalleComponent } from '../components/admin/cotizacion-detalle/cotizacion-detalle.component';
import { RepuestoListaComponent } from '../components/admin/repuesto-lista/repuesto-lista.component';
import { InicioComponent } from '../components/inicio/inicio.component';
import { ClientePerfilVentaComponent } from '../components/admin/cliente-perfil-venta/cliente-perfil-venta.component';
import { TallerDetalleComponent } from '../components/admin/taller-detalle/taller-detalle.component';
import { TallerPagoGeneralComponent } from '../components/admin/taller-pago-general/taller-pago-general.component';
import { RepuestoFisicoListaComponent } from '../components/admin/repuesto-fisico-lista/repuesto-fisico-lista.component';
import { ScrumListaComponent } from '../components/admin/scrum-lista/scrum-lista.component';
import { ClientePerfilScrumComponent } from '../components/admin/cliente-perfil-scrum/cliente-perfil-scrum.component';
import { ImagenViewComponent } from '../components/admin/imagen-view/imagen-view.component';

import { FormsModule } from '@angular/forms'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from "angular-datatables";
import { HttpClientModule } from '@angular/common/http';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CKEditorModule } from 'ng2-ckeditor';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxImageCompressService } from "ngx-image-compress";

@NgModule({
  declarations: [
    AdminComponent,
    IncHeaderComponent,
    IncFooterComponent,
    IncSiderbarComponent,
    PanelcontrolComponent,
    UsuarioAgregarComponent,
    UsuarioListaComponent,
    UsuarioPerfilComponent,
    UsuarioEditarComponent,
    ParqueoListaComponent,
    ParqueoModuloComponent,
    ParqueoPanelComponent,
    ParqueoVehiculoListaComponent,
    SucursalListaComponent,
    SucursalModuloComponent,
    SucursalPanelComponent,
    SucursalAgregarComponent,
    SucursalActualizarComponent,
    RecepcionListaComponent,
    RecepcionAgregarComponent,
    RecepcionDetalleComponent,
    DevolucionListaComponent,
    VentaListaComponent,
    ClienteListaComponent,
    ClienteAgregarComponent,
    ClienteEditarComponent,
    ClientePerfilComponent,
    CargoListaComponent,
    NotificacionListaComponent,
    GastoListaComponent,
    VerificacionPagoListaComponent,
    ParqueoSalidasComponent,
    ParqueoEntradasComponent,
    TallerListaComponent,
    ImportacionListaComponent,
    ImportacionAgregarComponent,
    ImportacionDetalleComponent,
    TallerModuloComponent,
    TallerVehiculoListaComponent,
    TallerRecepcionImportacionComponent,
    TallerRecepcionAgregarComponent,
    VehiculoListaComponent,
    BlogListaComponent,
    BlogAgregarComponent,
    BlogActualizarComponent,
    VehiculoAgregarExhibicionComponent,
    InicioComponent,
    SucursalContratoGarantiaComponent,
    SucursalReciboPagoComponent,
    SucursalDevolucionPagoComponent,
    ContratoEditarComponent,
    AdendaEditarComponent,
    ClienteAdendaEditarComponent,
    ClienteContratoEditarComponent,
    ProcesoListaComponent,
    ProcesoModeloComponent,
    CotizacionListaComponent,
    CotizacionDetalleComponent,
    RepuestoListaComponent,
    ClientePerfilVentaComponent,
    TallerDetalleComponent,
    TallerPagoGeneralComponent,
    RepuestoFisicoListaComponent,
    ScrumListaComponent,
    ClientePerfilScrumComponent,
    ImagenViewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CKEditorModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    //ToastrModule.forRoot(),
    DataTablesModule,
    HttpClientModule,
    //GoogleMapsModule,
    NgxDropzoneModule,
    NgxDropzoneModule,
    ImageCropperModule
  ],
  providers:[DatePipe]
})
export class AdminModule { }
