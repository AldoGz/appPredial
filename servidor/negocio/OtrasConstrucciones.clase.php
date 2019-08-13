<?php

require_once '../acceso/Conexion.clase.php';

class OtrasConstrucciones extends Conexion {
    private $cod_otras_construcciones;
    private $codigo;
    private $cod;
    private $item;
    private $componente;
    private $cod_denominacion;

    public function getCod_otras_construcciones(){
        return $this->cod_otras_construcciones;
    }
    
    public function setCod_otras_construcciones($cod_otras_construcciones){
        $this->cod_otras_construcciones = $cod_otras_construcciones;
        return $this;
    }

    public function getCodigo(){
        return $this->codigo;
    }
    
    public function setCodigo($codigo){
        $this->codigo = $codigo;
        return $this;
    }

    public function getCod(){
        return $this->cod;
    }
    
    public function setCod($cod){
        $this->cod = $cod;
        return $this;
    }

    public function getItem(){
        return $this->item;
    }
    
    public function setItem($item){
        $this->item = $item;
        return $this;
    }

    public function getComponente(){
        return $this->componente;
    }
    
    public function setComponente($componente){
        $this->componente = $componente;
        return $this;
    }

    public function getCod_denominacion(){
        return $this->cod_denominacion;
    }
    
    public function setCod_denominacion($cod_denominacion){
        $this->cod_denominacion = $cod_denominacion;
        return $this;
    }

    public function llenarCB() {        
        try {
            $sql = "SELECT 
                    cod, codigo, CONCAT('('||codigo||' - '||cod||') '||componente) as descripcion
                    FROM otras_construcciones
                    ORDER BY cod, codigo, componente";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }


    


}