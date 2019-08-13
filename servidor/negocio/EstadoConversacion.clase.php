<?php

require_once '../acceso/Conexion.clase.php';

class EstadoConversacion extends Conexion {
    private $cod_estado_conservacion;
    private $descripcion;

    public function getCod_estado_conservacion(){
        return $this->cod_estado_conservacion;
    }
    
    public function setCod_estado_conservacion($cod_estado_conservacion){
        $this->cod_estado_conservacion = $cod_estado_conservacion;
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
            $sql = "SELECT * FROM estado_conservacion";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }


    


}