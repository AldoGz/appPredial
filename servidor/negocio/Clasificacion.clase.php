<?php

require_once '../acceso/Conexion.clase.php';

class Clasificacion extends Conexion {
    private $cod_clasificacion;
    private $descripcion;

    public function getCod_clasificacion(){
        return $this->cod_clasificacion;
    }
    
    public function setCod_clasificacion($cod_clasificacion){
        $this->cod_clasificacion = $cod_clasificacion;
        return $this;
    }

    public function getDescripcion(){
        return $this->descripcion;
    }
    
    public function setDescripcion($descripcion){
        $this->descripcion = $descripcion;
        return $this;
    }

    public function llenarCB() {        
        try {
            $sql = "SELECT * FROM clasificacion";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }


    


}