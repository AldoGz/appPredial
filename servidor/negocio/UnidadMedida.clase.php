<?php

require_once '../acceso/Conexion.clase.php';

class UnidadMedida extends Conexion {
    private $cod_unidad_medida;
    private $abreviatura;
    private $descripcion;

    public function getCod_unidad_medida(){
        return $this->cod_unidad_medida;
    }
    
    public function setCod_unidad_medida($cod_unidad_medida){
        $this->cod_unidad_medida = $cod_unidad_medida;
        return $this;
    }

    public function getAbreviatura(){
        return $this->abreviatura;
    }
    
    public function setAbreviatura($abreviatura){
        $this->abreviatura = $abreviatura;
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
            $sql = "SELECT * FROM unidad_medida";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }


    


}