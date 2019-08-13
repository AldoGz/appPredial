<?php

require_once '../acceso/Conexion.clase.php';

class VuoeCategoria extends Conexion {
    private $cod_vuoe;
    private $categoria;
    private $descripcion;

    public function getCodVuoe()
    {
        return $this->cod_vuoe;
    }
    
    
    public function setCodVuoe($cod_vuoe)
    {
        $this->cod_vuoe = $cod_vuoe;
        return $this;
    }

    public function getCategoria()
    {
        return $this->categoria;
    }
    
    
    public function setCategoria($categoria)
    {
        $this->categoria = $categoria;
        return $this;
    }

    public function getDescripcion(){
        return $this->descripcion;
    }
    
    public function setDescripcion($descripcion){
        $this->descripcion = $descripcion;
        return $this;
    }

    public function cargarData() {        
        try {

            $sql = "SELECT cod_vuoe FROM vuoe ORDER BY cod_vuoe";
            $vuoe = $this->consultarFilas($sql);

            $resultado = [];
            foreach ($vuoe as $key => $value) {
                $cod_vuoe = $value["cod_vuoe"];
                $sql = "SELECT cat.cod_categoria, vce.categoria, vce.descripcion, vce.cod_vuoe
                        FROM vuoe_categoria_etiqueta vce
                        LEFT JOIN categoria cat ON cat.categoria = vce.categoria
                        WHERE cod_vuoe = :0
                        ORDER BY cod_vuoe, categoria, descripcion";

                $resultado[$cod_vuoe] = $this->consultarFilas($sql, [$cod_vuoe]);
            }
            
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }


    


}