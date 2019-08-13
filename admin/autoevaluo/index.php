<html lang="en">
<head>
    <?php require_once '../build/code/metas.vista.php'; ?>
    <title>AUTOAVALUO</title>
    <?php require_once '../build/code/estilos.vista.php'; ?>
    <?php require_once '../build/code/estilo_select2.vista.php'; ?>

  </head>
  <body>
    <main role="main" class="container">
        <br>
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h3><strong>Realizar Autoavaluo</strong></h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <strong>Datos del cliente</strong>
                                    </div>
                                    <div class="card-body" style="height:213px;">
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label>Buscar cliente</label>
                                                <select class="form-control show-tick" id="intCodigoCliente"></select> 
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-group">
                                                <label>Buscar predial del cliente</label>
                                                <select class="form-control show-tick" id="intCodigoPredial"></select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <strong>Datos de inspección</strong>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">                                                  
                                                    <label>Fecha de inspección</label>
                                                    <input class="form-control" type="date" id="strFechaInspeccion">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Fecha de emisión</label>
                                                    <input class="form-control" type="date" id="strFechaEmision"> 
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Año de inspección</label>
                                                    <input class="form-control" type="text" disabled="true" id="strAnioInspeccion"> 
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Área de terreno total</label>
                                                    <input class="form-control" type="text" id="strAreaTerrenoTotal"> 
                                                </div>
                                            </div> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <strong>Inmuebles</strong>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <button id="btnInmueble" style="margin-bottom: 15px;" type="button" class="btn btn-primary btn-md btn-block"><i class="fa fa-plus"></i> Nuevo inmueble</button>                                        
                                                <ul class="list-group" id="listado_inmuebles"></ul>                                 
                                            </div>
                                            <div class="col-md-9">
                                                <div class="tab-content" id="listado_inmuebles_piso">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <br>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <strong>Otras construcciones permanentes y fijas</strong>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-3">
                                                <button style="margin-bottom: 15px;" id="btnOtraConstruccion" type="button" class="btn btn-primary btn-md btn-block"><i class="fa fa-plus"></i> Nueva otra construcción</button>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="table-responsive">
                                                    <table id="tb_otra_construccion" class="table table-striped table-bordered table-hover" style="width:1800px">
                                                        <thead>
                                                            <tr>
                                                                <th style="text-align:center;" width="450px">Cód. construcción</th>
                                                                <th style="text-align:center;width:280px">Clase</th>
                                                                <th style="text-align:center;" width="220px">Material</th>
                                                                <th style="text-align:center;" width="220px">Estado conservación</th>
                                                                <th style="text-align:center;" width="150px">Mes</th>
                                                                <th style="text-align:center;" width="140px">Año</th>
                                                                <th style="text-align:center;" width="200px">Área Total m<sup>2</sup></th>
                                                                <th style="text-align:center;" width="150px">Unid. medida</th>
                                                                <th style="text-align:center;" width="100px">Participación %</th>
                                                                <th style="text-align:center;"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody id="tb_detalle_otra_construccion">                                  
                                                        </tbody>
                                                        <tfoot>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br>
                        <div class="col align-self-end">
                            <button style="margin-bottom: 15px;" id="btnGuardarAutoevaluo" type="button" class="btn btn-success btn-md btn-block"><i class="fa fa-save"></i> Realizar autoevaluo</button>
                        </div>
                        <!-- Modal -->
                        <div class="modal fade" id="cargando" role="dialog" data-backdrop="static" data-keyboard="false">
                            <div class="modal-dialog modal-dialog-centered" style="display:flex;justify-content:center;align-items:center;">
                                <img src="../../servidor/img/loader.gif" width="100" height="100" style="color:#FFF">
                                <label style="color:#FFF">Procesando, espere por favor</label>
                            </div>
                        </div>
                        <!-- Modal -->
                    </div>
                </div>
            </div>
        </div>
    </main>
    <?php require_once '../build/code/scripts.vista.php'; ?>
    <?php require_once '../build/code/select2.vista.php'; ?>
    <?php require_once '../build/code/funcionalidad.vista.php'; ?>
</body>

</html>