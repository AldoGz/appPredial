<?php

require_once '../acceso/Conexion.clase.php';

class MaterialEstructural extends Conexion {
    private $cod_material_estructural_predominante;
    private $descripcion;

    public function getCod_material_estructural_predominante(){
        return $this->cod_material_estructural_predominante;
    }
    
    public function setCod_material_estructural_predominante($cod_material_estructural_predominante){
        $this->cod_material_estructural_predominante = $cod_material_estructural_predominante;
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
            $sql = "SELECT * FROM material_estructural_predominante";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }


    


}