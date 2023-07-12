import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from '../components/admin/admin.component';

import { InicioComponent } from '../components/inicio/inicio.component';
import { RestriccionAdminComponent } from '../components/restriccion-admin/restriccion-admin.component';
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
import { GastoListaComponent } from '../components/admin/gasto-lista/gasto-lista.component';
import { VerificacionPagoListaComponent } from '../components/admin/verificacion-pago-lista/verificacion-pago-lista.component';
import { ParqueoEntradasComponent } from '../components/admin/parqueo-entradas/parqueo-entradas.component';
import { ParqueoSalidasComponent } from '../components/admin/parqueo-salidas/parqueo-salidas.component';
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
import { CotizacionListaComponent } from '../components/admin/cotizacion-lista/cotizacion-lista.component';
import { CotizacionDetalleComponent } from '../components/admin/cotizacion-detalle/cotizacion-detalle.component';
import { RepuestoListaComponent } from '../components/admin/repuesto-lista/repuesto-lista.component';
import { RepuestoFisicoListaComponent } from '../components/admin/repuesto-fisico-lista/repuesto-fisico-lista.component';
import { ClientePerfilVentaComponent } from '../components/admin/cliente-perfil-venta/cliente-perfil-venta.component';
import { TallerDetalleComponent } from '../components/admin/taller-detalle/taller-detalle.component';
import { TallerPagoGeneralComponent } from '../components/admin/taller-pago-general/taller-pago-general.component';
import { ScrumListaComponent } from '../components/admin/scrum-lista/scrum-lista.component';

const routes: Routes = [
  { path: '', component: PanelcontrolComponent, children:
  [
    { path: 'cliente/autoventa/:tipo', component: ClienteListaComponent},
    { path: 'cliente/importacion/:tipo', component: ClienteListaComponent},
    { path: 'cliente/agregar/:tipo', component: ClienteAgregarComponent},
    { path: 'cliente/editar/:id_cliente', component: ClienteEditarComponent},
    { path: 'cliente/perfil/:id_cliente', component: ClientePerfilComponent},
    { path: 'cliente/perfil-venta/:id_cliente', component: ClientePerfilVentaComponent},
    { path: 'showroom/:tipo', component: VehiculoListaComponent},
    { path: 'vehiculo/:tipo', component: VehiculoListaComponent},
    { path: 'vehiculo/agregar/:tipo/:id_cliente', component: VehiculoAgregarExhibicionComponent},
    { path: 'proceso', component: ProcesoListaComponent},
    { path: 'historia', component: ScrumListaComponent},
    { path: 'cotizacion', component: CotizacionListaComponent},
    { path: 'cotizacion/detalle/:id_cotizacion', component: CotizacionDetalleComponent},
    { path: 'inventario', component: ImportacionListaComponent},
    { path: 'importacion/detalle/:id_importacion', component: ImportacionDetalleComponent},
    { path: 'repuesto-inventario', component: RepuestoListaComponent},
    { path: 'repuesto-inventario-fisico', component: RepuestoFisicoListaComponent},
    { path: 'taller', component: TallerListaComponent},
    { path: 'taller/:id_taller', component: TallerListaComponent},
    { path: 'taller/vehiculo/:id_taller', component: TallerVehiculoListaComponent},
    { path: 'taller/detalle/:id_taller_vehiculo', component: TallerDetalleComponent},
    { path: 'taller-pago', component: TallerPagoGeneralComponent},
    { path: 'gasto', component: GastoListaComponent},

    { path: 'usuario', component: UsuarioListaComponent},
    { path: 'usuario/agregar', component: UsuarioAgregarComponent},
    { path: 'usuario/editar/:id_usuario', component: UsuarioEditarComponent},
    { path: 'usuario/perfil/:id_usuario', component: UsuarioPerfilComponent},
    { path: 'parqueo/:id_sucursal', component: ParqueoListaComponent},
    { path: 'parqueo', component: ParqueoModuloComponent , 
      children: [
        { path: 'panel/:id_sucursal/:id_parqueo', component: ParqueoPanelComponent},
        { path: 'vehiculo/:id_sucursal/:id_parqueo', component: ParqueoVehiculoListaComponent},
        
        { path: 'entradas/:id_parqueo', component: ParqueoEntradasComponent},
        { path: 'salidas/:id_parqueo', component: ParqueoSalidasComponent}
      ]
    },
    { path: 'sucursal', component: SucursalListaComponent},
    { path: 'sucursal/agregar', component: SucursalAgregarComponent},
    { path: 'sucursal/actualizar/:id_sucursal', component: SucursalActualizarComponent},
    { path: 'sucursal/recepcion/detalle/:id_sucursal/:id_recepcion', component: RecepcionDetalleComponent},
    { path: 'sucursal', component: SucursalModuloComponent, 
      children: [
        { path: 'panel/:id_sucursal', component: SucursalPanelComponent},
        { path: 'parqueo/:id_sucursal', component: ParqueoListaComponent},
        { path: 'recepcion/:id_sucursal', component: RecepcionListaComponent},
        { path: 'recepcion/agregar/:id_sucursal', component: RecepcionAgregarComponent},
        { path: 'devolucion/:id_sucursal', component: DevolucionListaComponent},
        { path: 'venta/:id_sucursal', component: VentaListaComponent},
        { path: 'verificacion/:id_sucursal', component: VerificacionPagoListaComponent},
        
        
        
      ]
    },
    
    { path: 'importacion/agregar/:id_sucursal', component: ImportacionAgregarComponent},
   
    { path: 'contratogarantia/:id_sucursal', component: SucursalContratoGarantiaComponent},
    { path: 'recibopago/:id_sucursal', component: SucursalReciboPagoComponent},
    { path: 'devolucionpago/:id_sucursal', component: SucursalDevolucionPagoComponent},
    
    { path: 'notificacion', component: NotificacionListaComponent},
    { path: 'configuracion/cargo-acceso', component: CargoListaComponent},
    { path: 'contrato', component: ContratoEditarComponent},
    { path: 'contrato/editar/:id_contrato', component: ClienteContratoEditarComponent},
    { path: 'adenda', component: AdendaEditarComponent},
    { path: 'adenda/editar/:id_adenda', component: ClienteAdendaEditarComponent},
   
    
    { path: 'blog', component: BlogListaComponent},
    { path: 'blog/agregar', component: BlogAgregarComponent},
    { path: 'blog/actualizar/:id_blog', component: BlogActualizarComponent},
    { path: 'restriccion', component: RestriccionAdminComponent },
    { path: 'inicio', component: InicioComponent}
  ]
}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
