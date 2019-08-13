<?php

require_once '../acceso/local_config.php';
require_once MODELO_FUNCIONES;
require_once '../negocio/Docente.clase.php';

if (!isset($_POST["p_array_datos"])) {
    Funciones::imprimeJSON(500, "Faltan parametros", "");
    exit();
}
parse_str($_POST["p_array_datos"], $datosFormulario);


try {
    $obj = new Docente();
    $obj->setCodigo_docente($datosFormulario["intCodigoDocente"]);
    $obj->setDocumento($datosFormulario["strDocumento"]);
    $obj->setNombres($datosFormulario["strNombres"]);
    $obj->setPaterno($datosFormulario["strPaterno"]);
    $obj->setMaterno($datosFormulario["strMaterno"]);
    $obj->setSexo($datosFormulario["intSexo"]);
    $obj->setFecha_nacimiento($datosFormulario["dateNacimiento"]);
    $obj->setFoto(empty($_FILES["p_foto"]) == 1 ? 'defecto.jpg' : $obj->correlativo());
    $obj->setDireccion($datosFormulario["strDireccion"]);
    $obj->setTelefono($datosFormulario["strTelefono"]);



    if (isset($_FILES["p_foto"])) {          
        $tmp = str_replace(" ", "_", $_FILES["p_foto"]["tmp_name"]);
        move_uploaded_file($tmp, "../images/docentes/".$obj->correlativo());    
    }

    $accion = $datosFormulario["operacion"] == 'agregar' ? $obj->agregar() : $obj->editar();
    Funciones::imprimeJSON(200, "OK",$accion);    
} catch (Exception $exc) {
    Funciones::imprimeJSON(500, $exc->getMessage(), "");
}
