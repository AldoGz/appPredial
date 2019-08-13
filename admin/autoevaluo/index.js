var DOM = {},
    _LISTA_REPETIDOS = [];

$(document).ready(function () {
    setDOM();
    setEventos();
    cargarClientes();
    cargarCategoria();
    cargarUnidadMedida();
    cargarEstadoConservacion();
    cargarMaterialEstructural();
    cargarClasificacion();
    cargarOtrasConstrucciones();

    $("input").val();
});
function setDOM() {
    DOM.cb_cod_cliente = $("#intCodigoCliente");
    DOM.cb_cod_predio = $("#intCodigoPredial");
    DOM.strFechaInspeccion = $("#strFechaInspeccion");
    DOM.strFechaEmision = $("#strFechaEmision");
    DOM.strAnioInspeccion = $("#strAnioInspeccion");
    DOM.strAreaTerrenoTotal = $("#strAreaTerrenoTotal");
    DOM.btnInmueble = $("#btnInmueble");
    DOM.listado_inmuebles = $("#listado_inmuebles");
    DOM.listado_inmuebles_piso = $("#listado_inmuebles_piso");
    DOM.btnOC = $("#btnOtraConstruccion");
    DOM.tb_detalle_otra_construccion = $("#tb_detalle_otra_construccion");
    DOM.array_categoria_etiquetas = [];
    DOM.string_unidad_medida = '';
    DOM.string_clasificacion = '';
    DOM.string_material_estructural = '';
    DOM.string_estado_conservacion = '';
    DOM.array_otras_construccion = [];

    DOM.btnGuardarAutoevaluo = $("#btnGuardarAutoevaluo");
}

function setEventos() { 
    DOM.cb_cod_cliente.change(function () { 
        if ( DOM.cb_cod_cliente.val() !== "" )   {
            cargarPredio();
        }else{
            DOM.cb_cod_predio.select2('destroy'); 
            DOM.cb_cod_predio.empty();            
        }
    });

    DOM.strFechaInspeccion.change(function(){
        if ( this.value !== "" ) {
            DOM.strAnioInspeccion.val(this.value.split("-")[0]);           
        }else{
            DOM.strAnioInspeccion.val("");  
        }         
    });

    DOM.strAreaTerrenoTotal.keypress(function(e){        
        return Validar.numeroDecimal(e,this.value,8,2);
    });
    
    DOM.btnInmueble.click(function(){
        eliminarActive();
        var numero = DOM.listado_inmuebles.find("li").length+1;        
        var li = inmuebleHTML(numero, true);
        var lip = inmueblePisoHTML(numero);        
        DOM.listado_inmuebles.append(li);
        DOM.listado_inmuebles_piso.append(lip);
    });

    DOM.listado_inmuebles.on("click","li span i", function(){ 
        var $li = this.parentElement.parentElement;
        var bandera = this.classList.contains('quitar_inmueble');
        if ( bandera ) {
            if (confirm('Desea quitar este inmueble?')) {
                $li.remove();
                eliminarTab($li);
                activarInmueble($li);
                activarInmueblePiso();
                cambiarNameInmueble();
                cambiarNameInmueblePiso();
            }
        }
    }); 

    DOM.listado_inmuebles_piso.on("click","button", function(){
        var bandera = this.classList.contains('agregarPisoInmueble');
        if ( bandera ) {            
            addPiso(this.dataset.id);
        }
    });

    DOM.listado_inmuebles_piso.on("click","button", function(){
        $tr = this.parentElement.parentElement;
        var bandera = this.classList.contains('quitar_inmueble_piso');
        if ( bandera ) {
            if (confirm('Desea quitar este inmueble piso?')) {
                $tr.remove();
            }
        }
    });

    DOM.listado_inmuebles_piso.on("keypress","input", function(e){
        var bandera = this.classList.contains('propio_inmueble_piso');
        if ( bandera ) {
            return Validar.numeroDecimal(e,this.value,8,2);
        }
    });

    DOM.listado_inmuebles_piso.on("keypress","input", function(e){
        var bandera = this.classList.contains('comun_inmueble_piso');
        if ( bandera ) {
            return Validar.numeroDecimal(e,this.value,8,2);
        }
    });

    DOM.btnOC.click(function(){
        addOtraConstruccion();
    });

    DOM.tb_detalle_otra_construccion.on("keyup","tr td input", function(){       
        var bandera = this.classList.contains('otras_construcciones');
        if ( bandera ) {            
            cargarAutocompletarOtrasConstrucciones(this);
        }        
    });


    DOM.tb_detalle_otra_construccion.on("keypress","tr td input", function(e){
        var bandera = this.classList.contains('area_total');
        if ( bandera ) {
            return Validar.numeroDecimal(e,this.value,8,2);
        }
    });

    DOM.tb_detalle_otra_construccion.on("keypress","tr td input", function(e){
        var bandera = this.classList.contains('partic');        
        if ( bandera ) {
            if ( this.value.length <= 2) {
                return validarParticion(this.value,e);
            }
            return false;
        }
    });  

    DOM.tb_detalle_otra_construccion.on("click","tr td button", function(){       
        var bandera = this.classList.contains('eliminar');
        $tr = this.parentElement.parentElement;
        if ( bandera ) {
            if (confirm('Desea quitar esta otra construcción?')) { 
                $tr.remove();   
            }
        }
    });

    DOM.btnGuardarAutoevaluo.click(function(){
        var retornoValidar = validarEntrada();
        if (retornoValidar == 0)
            return;
        var array_inmueble = [], continuar = true;
        array_inmueble.splice(0, array_inmueble.length);
        $.each(validarInmueblePiso(),function(i,item){
            var array = [];
            array.splice(0, array.length);
            _LISTA_REPETIDOS = [];
            $(item.tab).find("tr").each(function(){
                var piso = $(this).find("td").eq(1).find("input")[0].value;
                var interior = $(this).find("td").eq(2).find("input")[0].value;

                if (chequearPisoInteriorRepetido(piso+"-"+interior)){
                    continuar = false;
                    return false;    
                }
                
                var mes = $(this).find("td").eq(3).find("select")[0].value;
                var anio = $(this).find("td").eq(4).find("select")[0].value;
                var clase = $(this).find("td").eq(5).find("select")[0].value;
                var material = $(this).find("td").eq(6).find("select")[0].value;
                var estado = $(this).find("td").eq(7).find("select")[0].value;
                var cadena_categorias = StringCategoria(this);
                var propia = $(this).find("td").eq(15).find("input")[0].value;
                var comun = $(this).find("td").eq(16).find("input")[0].value;
                var obj = {
                    mes: parseInt(mes),
                    anio: parseInt(anio),
                    numero_piso: parseInt(piso),
                    numero_division: parseInt(interior),
                    cod_clasificacion: parseInt(clase),
                    cod_material_estructural: parseInt(material),
                    cod_estado_conservacion: parseInt(estado),
                    cadena_categorias: cadena_categorias,
                    area_construida_propia: parseFloat(propia),
                    area_construida_comun: parseFloat(comun)
                }
                array.push(obj);                
            });

            if (continuar == false){
                return false;
            }
            var inmuebles = {
                inspeccion_inmueble : array
            }
            array_inmueble.push(inmuebles);
        });         

        if (continuar == false){
            alert("Al parecer hay pisos e interiores iguales, corregir.")
            return false;
        }   
        var json_inmuebles = JSON.stringify(array_inmueble);

        var array_otra_construccion = [];
        array_otra_construccion.splice(0, array_otra_construccion.length);

        DOM.tb_detalle_otra_construccion.find("tr").each(function(){
            var cod_otra_construccion = $(this).find("td").eq(0).find("select")[0].value;
            var codigo_otra_construccion = $(this).find("td").eq(0).find("select")[0].children[$(this).find("td").eq(0).find("select")[0].selectedIndex].dataset.codigo;
            var clase = $(this).find("td").eq(1).find("select")[0].value;
            var material = $(this).find("td").eq(2).find("select")[0].value;
            var estado = $(this).find("td").eq(3).find("select")[0].value;
            var mes_evaluacion = $(this).find("td").eq(4).find("select")[0].value;
            var anio_evaluacion = $(this).find("td").eq(5).find("select")[0].value;
            var area_total = $(this).find("td").eq(6).find("input")[0].value;
            var porcentaje = $(this).find("td").eq(8).find("input")[0].value;

            var obj = {
                cod:cod_otra_construccion,
                codigo:codigo_otra_construccion,
                cod_clasificacion: parseInt(clase),
                cod_material_estructural: parseInt(material),
                cod_estado_conservacion: parseInt(estado),
                anio: parseInt(anio_evaluacion),
                mes: parseInt(mes_evaluacion),
                medida_cantidad: parseFloat(area_total),
                participacion: parseFloat((porcentaje / 100.00).toFixed(2))
            }
            array_otra_construccion.push(obj);                
        });
        var json_otra_construccion = JSON.stringify(array_otra_construccion);

        var funcion = function (resultado) {        
            if ( resultado.estado === 200 ) {
                if ( resultado.datos.r === 1 ) {
                    $("#cargando").modal('show');
                    setTimeout(function(){ 
                        alert(resultado.datos.mensaje+ ' el codigo de inspección es '+resultado.datos.cod_inspeccion);
                        window.location.reload();  
                    }, 1000);
                }else{
                    console.error(resultado.datos.mensaje);
                }
            }
        };

        new Ajxur.Api({
            modelo: "RealizarAutoevaluo",
            metodo: "insercion",
            data_in : {
                p_codigo_predio : DOM.cb_cod_predio.val(),
                p_anio_evaluacion : DOM.strAnioInspeccion.val(),
                p_area_terreno : DOM.strAreaTerrenoTotal.val(),
                p_json_inmuebles : json_inmuebles,
                p_json_edificaciones : json_otra_construccion
            }
        }, funcion);  
    });
    

}


function activarInmueble(li){
    $aux = parseInt($(li)[0].textContent.split(" ")[1]) === 1 ? 2 : (parseInt($(li)[0].textContent.split(" ")[1])-1);
    DOM.listado_inmuebles.find("li").each(function(){
        $i = parseInt($(this)[0].textContent.split(" ")[1]);
        if ( $i === $aux ) {
            $(this).addClass('show');
            $(this).addClass('active');
        }else{
            $(this).removeClass('show');
            $(this).removeClass('active');
        }
    });
}

function activarInmueblePiso(){
    $aux;
    DOM.listado_inmuebles.find("li").each(function(){
        if ( $(this)[0].classList[5] === 'active' ) {
            $aux = $(this)[0].attributes[1].nodeValue.substr(1);
        }
    });  

    DOM.listado_inmuebles_piso.find(".tab-pane").each(function(i,v){
        if ( $aux === $(this)[0].id ) {
            $(this).addClass('show');
            $(this).addClass('in');
            $(this).addClass('active');
        }else{
            $(this).removeClass('show');
            $(this).removeClass('in');
            $(this).removeClass('active');
        }
    });
}

function eliminarTab(li){
    DOM.listado_inmuebles_piso.find(".tab-pane").each(function(){
        if ( $(li)[0].attributes[1].nodeValue.substr(1) === $(this)[0].id ) {
            $(this).remove();
        }
    });     
}

function StringCategoria(c){
    var numero = 8;
    var cadena = '[';
    while( numero <= 14 ){
        var categoria = $(c).find("td").eq(numero).find("select")[0].value;
        if ( numero === 14 ) {
            cadena += categoria;
        }else{
            cadena += categoria+',';    
        }
        numero++;
    }
    cadena += ']';
    return cadena;
}

function validarInmueblePiso(){
    var lip = [];
    DOM.listado_inmuebles.find("li").each(function(){
        var tab = $(this)[0].attributes[1].value.substr(1);
        var name = $(this)[0].textContent;

        var obj = {
            tab : "#detalle_inmueble_piso_"+tab,
            name : name
        }
        lip.push(obj);
    });
    return lip;
}

function validarEntrada(){
    if ( DOM.cb_cod_cliente.val() === "" ) {
        alert("Debe seleccionar un cliente");
        return 0;
    }   

    if ( DOM.cb_cod_predio.val() === "" || DOM.cb_cod_predio[0].children.length === 0 ) {
        alert("Debe seleccionar un predio del cliente");
        return 0;
    }

    if ( DOM.strFechaInspeccion.val() === "" ) {
        alert("Debe ingresar la fecha de inspección");
        return 0;   
    }

    if ( DOM.strFechaEmision.val() === "" ) {
        alert("Debe ingresar la fecha de emisión");
        return 0;   
    }

    var fecha = new Date();
    var anio_tope = fecha.getFullYear()+1;

    if ( !( parseInt(DOM.strAnioInspeccion.val()) >= 1950 && parseInt(DOM.strAnioInspeccion.val()) <= anio_tope ) ) {
        alert("Debe seleccionar entre 1950 a "+anio_tope);
        return 0;   
    }

    if ( DOM.strAreaTerrenoTotal.val() === "" ) {
        alert("Debe ingresar un área de terreno total");
        return 0;   
    }

    if ( DOM.listado_inmuebles[0].children.length === 0 ) {
        alert("Debe tener al menos un inmueble para registrar");
        return 0;
    }
     
    if ( validarInmueblePisoRecorrido() > 0 ) {
        return 0; 
    } 

    if ( DOM.tb_detalle_otra_construccion.find('tr').length <= 0 ){            
        alert("Debe tener al menos un edificacion para registrar");        
        return 0; //detiene el programa
    }


    if ( validarAreaTotalInmueblePiso().x_contador > 0 ) {
        var arreglo = similaresInmueblePiso();
        $.each(arreglo,function(i,item){
            texto = "";
            if ( item.numero === 1 ) {
                texto += "uno columna";
            }else{
                texto += "mas de uno columnas";
            }
            alert("Advertencia: En la tabla "+item.etiqueta+", tiene "+texto+" con el área total a cero");        
        });
        return 0; 
    }

    if ( validarAreaTotalOtraConstruccion() > 0 ) {
        texto = "";
        if ( validarAreaTotalOtraConstruccion() === 1 ) {
            texto += "uno columna";
        }else{
            texto += "mas de uno columnas";
        }
        alert("Advertencia: En la tabla otras construcciones, tiene "+texto+" con el área total a cero");
        return 0; 
    }
}

function similaresInmueblePiso(){
    var array = validarAreaTotalInmueblePiso().x_tabla_name;
    var nuevo_array = [];
    $.each(array, function(i,o){
        var contar = 1;
        var bandera = false;
        $.each(nuevo_array, function(j,x){                
            if( o === x.etiqueta ){                    
                x.numero++;
                bandera = true;
            }else{
                bandera = false;
            }                
        }); 
        if ( !bandera ) {
            var obj = {
                numero : contar,
                etiqueta : o
            }
            nuevo_array.push(obj);
        }        
    });
    return nuevo_array;
}

function validarAreaTotalOtraConstruccion(){
    var contador = 0;
    DOM.tb_detalle_otra_construccion.find('tr').each(function(){            
        if ( parseFloat($(this).find("td").eq(6).find("input")[0].value) === 0 ) {
            contador++;
        }
    });
    return contador;
}

function validarAreaTotalInmueblePiso(){
    var contador = 0;
    var arreglo = [];
    $.each(validarInmueblePiso(),function(i,item){        
        $(item.tab).find('tr').each(function(){ 
            if ( parseFloat($(this).find("td").eq(15).find("input")[0].value) === 0 ) {
                contador++;
                arreglo.push(item.name);
            }
        });        
    });
    var obj = {
        x_contador : contador,
        x_tabla_name : arreglo
    }
    return obj;
}

function validarInmueblePisoRecorrido(){
    var contador = 0;
    $.each(validarInmueblePiso(),function(i,item){        
        if( $(item.tab).find("tr").length <= 0 ){            
            alert("El "+ item.name.toLowerCase() +" debe tener al menos un piso para registrar");                
            contador++;
        }
        
    });
    return contador;
}

function cargarClientes(){
    var funcion = function (resultado) {        
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = '<option selected></option>';
                $.each(resultado.datos.msj, function (i, item) { 
                    html += '<option value="' + item.cod_cliente + '">' + '(' + item.ruc + ') ' + item.nombre + '</option>';
                });
                DOM.cb_cod_cliente.html(html).select2({
                    placeholder: "Escriba al cliente a buscar",
                    allowClear: true,
                    minimumInputLength: 1
                });             
             
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }            
        }
    };

    new Ajxur.Api({
        modelo: "Clientes",
        metodo: "llenarCB"
    }, funcion);
}

function cargarPredio(){
    var funcion = function (resultado) {        
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                var html = '';
                html += '<option selected></option>';
                $.each(resultado.datos.msj, function (i, item) { 
                    html += '<option value="' + item.cod_predio + '">' + '(' + item.partida_registral + ') ' + item.domicilio_fiscal + '</option>';
                });

                DOM.cb_cod_predio.html(html).select2({
                    placeholder: "Seleccionar predio",
                    allowClear: true
                });             
             
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }            
        }
    };

    new Ajxur.Api({
        modelo: "Predios",
        metodo: "llenarCB",
        data_in : {
            p_cod_cliente : DOM.cb_cod_cliente.val()
        }
    }, funcion);
}

function eliminarActive(){
    DOM.listado_inmuebles.find("li").each(function(){
        $(this).removeClass("show");
        $(this).removeClass("active");
    });
    DOM.listado_inmuebles_piso.find(".fade").each(function(){
        $(this).addClass('show');
        $(this).removeClass("in");
        $(this).removeClass("active");
    });
}

function inmuebleHTML(numero,nuevo){
    var li = '';
    if ( nuevo ) {
        li += '<li class="list-group-item d-flex justify-content-between align-items-center active" href="#tab'+numero+'" data-toggle="tab">';        
            li += 'Inmueble '+numero;
            li += '<span class="badge badge-primary badge-pill"><i class="fa fa-times quitar_inmueble"></i></span>';
        li += '</li>';
    }else{
        li += 'Inmueble '+numero;
        li += '<span class="badge badge-primary badge-pill"><i class="fa fa-times quitar_inmueble"></i></span>';
    }
    return li;
}

function inmueblePisoHTML(numero){
    var lip = '';
    lip += '<div class="tab-pane fade show in active" id="tab'+numero+'">';
        lip += '<div class="row">';
            lip += '<div class="card">';
                lip += '<div class="card-header">';
                    lip += '<strong>Inmueble '+numero+'</strong>';                                        
                lip += '</div>';
                lip += '<div class="card-body">';
                    lip += '<div class="col-md-3">';
                        lip += '<button data-id="tab'+numero+'" style="margin-bottom: 15px;" type="button" class="btn btn-primary btn-md btn-block agregarPisoInmueble"><i class="fa fa-plus"></i> Nuevo piso</button>';
                    lip += '</div>';
                    lip += '<div class="col-md-12">';
                        lip += '<div class="table-responsive">';
                            lip += '<table id="inmueble_piso_tb'+numero+'" class="table table-striped table-bordered table-hover" style="width:2000px;">';
                                lip += '<thead>';
                                    lip += '<tr>';
                                        lip += '<th style="text-align:center;"></th>';
                                        lip += '<th colspan="4" style="text-align:center;width:200px;"></th>';
                                        lip += '<th colspan="3" style="text-align:center;">DEPRECIACIÓN</th>';
                                        lip += '<th colspan="7" style="text-align:center;">CATEGORÍA</th>';
                                        lip += '<th colspan="2" style="text-align:center;">ÁREA EN m<sup>2</sup></th>';
                                    lip += '</tr>';
                                    lip += '<tr>';
                                        lip += '<th style="text-align:center;"></th>';
                                        lip += '<th style="text-align:center;width:270px;">PISO</th>';
                                        lip += '<th style="text-align:center;width:60px;">INTERIOR</th>';
                                        lip += '<th style="text-align:center;width:130px;">MES</th>';
                                        lip += '<th style="text-align:center;width:100px;">AÑO</th>';
                                        lip += '<th style="text-align:center;width:200px;">CLASE</th>';
                                        lip += '<th style="text-align:center;width:150px;">MATERIAL</th>';
                                        lip += '<th style="text-align:center;width:150px;">CONSERVACIÓN</th>';

                                        lip += '<th style="text-align:center;width:120px;" title="Muros y columnas">M/C</th>';
                                        lip += '<th style="text-align:center;width:120px;  title="Techos">TEC</th>';
                                        lip += '<th style="text-align:center;width:120px;" title="Pisos">P</th>';
                                        lip += '<th style="text-align:center;width:120px;" title="Puertas y Ventanas">P/V</th>';
                                        lip += '<th style="text-align:center;width:120px;" title="Revestimientos">REV</th>';
                                        lip += '<th style="text-align:center;width:120px;" title="Baños">BÑ</th>';
                                        lip += '<th style="text-align:center;width:120px;" title="Instalaciones eléctricas y sanitarias">I/E</th>';
                                        lip += '<th style="text-align:center;width:120px;">PROPIA</th>';
                                        lip += '<th style="text-align:center;width:120px;">COMÚN</th>';                                    
                                    lip += '</tr>';
                                lip += '</thead>';
                                lip += '<tbody id="detalle_inmueble_piso_tab'+numero+'">';
                                lip += '</tbody>';
                                lip += '</tfoot>';
                                lip += '</tfoot>';
                            lip += '<table>';
                        lip += '</div>';
                    lip += '</div>';
                lip += '</div>';
            lip += '</div>';
        lip += '</div>';
    lip += '</div>';
    return lip;
}





function cambiarNameInmueble(){
    DOM.listado_inmuebles.find("li").each(function(index){
        var numero = index+1;
        $(this)[0].innerHTML = inmuebleHTML(numero,false);
    });
}

function cambiarNameInmueblePiso(){
    DOM.listado_inmuebles_piso.find("strong").each(function(index){
        var numero = index+1;
        $(this)[0].textContent = "Inmueble "+numero;
    });
}

function validarTablaPiso(texto){
    var controlador = 0;
    if ( $(texto).find("tr").length > 0 ) {                            
        $(texto).find("tr").each(function(){
            var piso = $(this).find("td").eq(1).find("input")[0].value,
                interior = $(this).find("td").eq(2).find("input")[0].value,
                anio = $(this).find("td").eq(4).find("select")[0].value,
                propio = $(this).find("td").eq(15).find("input")[0].value;
                comun = $(this).find("td").eq(16).find("input")[0].value;
            if ( piso === "" || interior === "" || anio === "" || propio === "" || comun === "" ) {
                controlador++;
            }
        });                                          
    }
    if ( controlador > 0 ) {
        return false;
    }
    return true;
}



function contadorPiso(texto){
    var contador = 1;
    var array = [];
    if ( $(texto).find("tr").length > 0 ) {

        $(texto).find("tr").each(function(){
            var piso = $(this).find("td").eq(1).find("input")[0].value;
            array.push(piso);
        });    
        contador = parseInt(array.pop())+1;
    }
    return contador;    
}

function mismoInteriorInmueble(texto){
    
    if ( $(texto).find("tr").length > 0 ) {
        var array = [];
        $(texto).find("tr").each(function(){
            var piso = $(this).find("td").eq(1).find("input")[0].value;
            var interior = $(this).find("td").eq(2).find("input")[0].value;            

            var obj = {
                piso : piso,
                interior : interior
            }
            array.push(obj);
        });
        var nuevo_array = [];
        var bandera = false;        
        $.each(array, function(i,o){
            var contar = 1; 
            var texto_etiqueta = o.piso+'.'+o.interior;           
            $.each(nuevo_array, function(j,x){                
                if( texto_etiqueta === x.etiqueta ){
                    bandera = true;
                }                
            });
            if ( !bandera ) {
                var obj = {
                    numero : contar,
                    etiqueta : texto_etiqueta
                }
                nuevo_array.push(obj);
            }
        });      
        return bandera;      
    }    
}

var obtenerHTMLMeses = function(){
    var html = "",
        meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SETIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

        html += '<select class="form-control" >';
        for (var i = 1; i <= meses.length; i++) {
            html += '<option value="'+i+'">'+meses[i-1]+'</option>';
        };
        html += '</select>';

    return html;
};

var obtenerHTMLAnios = function(){
     var fecha = new Date(),
            html ="", 
            ultimoAnio = 1940;
     html += '<select class="form-control" >';
        for (var i = fecha.getFullYear(); i >= ultimoAnio; i--) {
            html += '<option value="'+i+'">'+i+'</option>';
        };
     html += '</select>';
    return html;
};

function addPiso(id){
    var texto = '#detalle_inmueble_piso_'+id;
    var fecha = new Date();
    if ( !validarTablaPiso(texto) ) {
        alert("Debe llenar todo los campos para agregar un nueva fila");
        return 0;
    }
    if ( mismoInteriorInmueble(texto) ) {
        alert("Advertencia: Hay similitud en la columnas de piso e interiores");
        return 0;
    }
    ;
    var contador = contadorPiso(texto);    
    var html = '';
    html += '<tr>';
        html += '<td align="center">';
            html += '<button type="button" class="btn btn-danger btn-circle quitar_inmueble_piso"><i class="fa fa-times"></i></button>';            
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += '<input type="number" value="'+contador+'"  min="1"  class="form-control piso_inmueble_piso" style="text-align:center;">';        
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += '<input type="number" value="1" min="1" class="form-control interior_inmueble_piso" style="text-align:center;">';
        html += '</td>';
        html += '<td style="text-align:center;width:130px">';
            html += obtenerHTMLMeses();
        html += '</td>';
        html += '<td style="text-align:center;width:100px">';
            html += obtenerHTMLAnios();
            //html += '<input type="text" value="'+fecha.getFullYear()+'" class="form-control anio_inmueble_piso" style="text-align:center;">';
        html += '</td>';
        html += '<td style="text-align:center;">'+DOM.string_clasificacion+'</td>';
        html += '<td style="text-align:center;">'+DOM.string_material_estructural+'</td>';
        html += '<td style="text-align:center;">'+DOM.string_estado_conservacion+'</td>';
        for (var i = 0; i < DOM.array_categoria_etiquetas.length; i++) {
              html += '<td style="text-align:center;">'+DOM.array_categoria_etiquetas[i]+'</td>';
        };
        html += '<td style="text-align:center;width:120px">';
            html += '<input type="text" value="0.00" class="form-control propio_inmueble_piso" style="text-align:center;">';
        html += '</td>';
        html += '<td style="text-align:center;width:120px">';
            html += '<input type="text" value="0.00" class="form-control comun_inmueble_piso" style="text-align:center;">';
        html += '</td>';
    html += '</tr>';
    $(texto).append(html);
}


function cargarClasificacion(){
    var funcion = function (resultado) {        
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                DOM.string_clasificacion += '<select class="form-control">';
                $.each(resultado.datos.msj, function (i, item) { 
                    DOM.string_clasificacion += '<option value="' + item.cod_clasificacion + '">' + item.descripcion + '</option>';
                });
                DOM.string_clasificacion += '</select>';                
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }            
        }
    };

    new Ajxur.Api({
        modelo: "Clasificacion",
        metodo: "llenarCB"
    }, funcion);
}

function cargarMaterialEstructural(){
    var funcion = function (resultado) {        
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                DOM.string_material_estructural += '<select class="form-control">';
                $.each(resultado.datos.msj, function (i, item) { 
                    DOM.string_material_estructural += '<option value="' + item.cod_material_estructural_predominante + '">' + item.descripcion + '</option>';
                });
                DOM.string_material_estructural += '</select>';                
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }            
        }
    };

    new Ajxur.Api({
        modelo: "MaterialEstructural",
        metodo: "llenarCB"
    }, funcion);
}

function cargarEstadoConservacion(){
    var funcion = function (resultado) {        
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                DOM.string_estado_conservacion += '<select class="form-control">';
                $.each(resultado.datos.msj, function (i, item) { 
                    DOM.string_estado_conservacion += '<option value="' + item.cod_estado_conservacion + '">' + item.descripcion + '</option>';
                });
                DOM.string_estado_conservacion += '</select>';                
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }            
        }
    };

    new Ajxur.Api({
        modelo: "EstadoConversacion",
        metodo: "llenarCB"
    }, funcion);
}

function cargarUnidadMedida(){
    var funcion = function (resultado) {        
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                DOM.string_unidad_medida += '<select class="form-control">';
                $.each(resultado.datos.msj, function (i, item) { 
                    DOM.string_unidad_medida += '<option value="' + item.cod_unidad_medida + '">' + item.abreviatura + '</option>';
                });
                DOM.string_unidad_medida += '</select>';                
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }            
        }
    };

    new Ajxur.Api({
        modelo: "UnidadMedida",
        metodo: "llenarCB"
    }, funcion);
}

function validarNumero(valor,e,entero){
    if ( valor === ""  &&   e.which === 48  ) {
        return false;
    }
    return Validar.soloNumeros(e,valor,entero);
}


function validarParticion(valor,e){
    if ( valor === "" && e.which === 48 ) {
        return false;
    }
    if ( valor === "10" && ( e.which >= 49 && e.which <= 57 )) {
        return false;
    }
    if ( valor !== "10" && valor.length == 2 ) {
        return false;
    }
    return Validar.soloNumeros(e);
}

function validarTablaOtraConstruccion(){
    var controlador = 0;
    if ( DOM.tb_detalle_otra_construccion.find("tr").length > 0 ) {                            
        DOM.tb_detalle_otra_construccion.find("tr").each(function(){
            var cod_otra_construccion = $(this).find("td").eq(0).find("select")[0].value;
            var area_total = parseFloat($(this).find("td").eq(6).find("input")[0].value);
            if ( cod_otra_construccion === "" || area_total === 0.00 ) {
                controlador++;
            }
        });                                          
    }
    if ( controlador > 0 ) {
        return false;
    }
    return true;
}

function addOtraConstruccion(){
    if ( !validarTablaOtraConstruccion() ) {
        alert("Debe llenar todo los campos para agregar un nueva fila");
        return 0;
    };    
    var id = "cb"+DOM.tb_detalle_otra_construccion.find("tr").length+1;    
    var fecha = new Date();
    var html = '';
    html += '<tr >';
        html += '<td style="text-align:center; class="form-control select2">';
            html += '<select style="width:450px" class="form-control dataselect" id="'+id+'">';
                html += '<option></option>';
                $.each(DOM.array_otras_construccion, function (i, item) {
                    html += '<option value="'+item.cod+'" data-codigo="'+item.codigo+'">'+item.text+'</option>';
                });
            html += '</select>';
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += DOM.string_clasificacion;
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += DOM.string_material_estructural;
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += DOM.string_estado_conservacion;
        html += '</td>';
         html += '<td style="text-align:center;">';
            html += obtenerHTMLMeses();
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += obtenerHTMLAnios();
            //html += '<input type="text" value="'+fecha.getFullYear()+'" class="form-control anio_inmueble_piso" style="text-align:center;">';
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += '<input type="text" value="0.00" class="form-control area_total" style="text-align:center;">';
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += DOM.string_unidad_medida;
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += '<input type="number" value="100" class="form-control partic" style="text-align:center;">';
        html += '</td>';
        html += '<td style="text-align:center;">';
            html += '<button type="button" class="btn btn-danger btn-circle eliminar"><i class="fa fa-times"></i></button>';
        html += '</td>';
    html += '</tr>';
    DOM.tb_detalle_otra_construccion.append(html);
    var indicador = '#'+DOM.tb_detalle_otra_construccion.find("tr")[DOM.tb_detalle_otra_construccion.find("tr").length-1].children[0].children[0].id;
    $(indicador).select2({
        placeholder: "Escribe código de edificación",
        allowClear: true,
        minimumInputLength: 1
    });
};

function cargarOtrasConstrucciones(){
    var funcion = function (resultado) {        
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                $.each(resultado.datos.msj, function (i, item) { 
                    var valor = item.cod,
                        codigo = item.codigo,
                        texto = item.descripcion,
                        obj = {
                            cod : valor,
                            codigo: codigo,
                            text : texto
                        };
                    DOM.array_otras_construccion.push(obj);
                });
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }            
        }
    };

    new Ajxur.Api({
        modelo: "OtrasConstrucciones",
        metodo: "llenarCB"
    }, funcion);
}


function cargarCategoria(){
    var funcion = function (resultado) {        
        if (resultado.estado === 200) {
            if (resultado.datos.rpt === true) {
                DOM.array_categoria_etiquetas = [];
                $.each(resultado.datos.msj, function(i,o){
                    var html = '<select class="form-control">';
                    $.each(o, function (_i, _o) { 
                        html += '<option value="' + _o.cod_categoria + '">['+_o.categoria +'] - '+ _o.descripcion + '</option>';
                    });
                    html +=  '</select>'; 
                    DOM.array_categoria_etiquetas.push(html);
                });   
            }else{
                alert(resultado.datos.msj.errorInfo[2]);
            }            
        }
    };

    new Ajxur.Api({
        modelo: "VuoeCategoria",
        metodo: "cargarData"
    }, funcion);
}

function chequearPisoInteriorRepetido(piso_interior){
    /*Buscar por repetidos*/
    var repetidos = false;
    for (var i = _LISTA_REPETIDOS.length - 1; i >= 0; i--) {
        if (_LISTA_REPETIDOS[i] == piso_interior){
           repetidos = true;
           continue;  
        }
        
    };

    if (repetidos == false){
        _LISTA_REPETIDOS.push(piso_interior);
    }

    return repetidos;
    
}