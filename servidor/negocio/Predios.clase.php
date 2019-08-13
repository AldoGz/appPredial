<?php

require_once '../acceso/Conexion.clase.php';

class Predios extends Conexion {
    private $cod_predio;
    private $partida_registral;
    private $area_terreno;
    private $domicilio_fiscal;
    private $cod_cliente;
    private $cod_zona;

    public function getCod_predio(){
        return $this->cod_predio;
    }
    
    public function setCod_predio($cod_predio){
        $this->cod_predio = $cod_predio;
        return $this;
    }

    public function getPartida_registral(){
        return $this->partida_registral;
    }
    
    public function setPartida_registral($partida_registral){
        $this->partida_registral = $partida_registral;
        return $this;
    }

    public function getArea_terreno(){
        return $this->area_terreno;
    }
    
    public function setArea_terreno($area_terreno){
        $this->area_terreno = $area_terreno;
        return $this;
    }

    public function getDomicilio_fiscal(){
        return $this->domicilio_fiscal;
    }
    
    public function setDomicilio_fiscal($domicilio_fiscal){
        $this->domicilio_fiscal = $domicilio_fiscal;
        return $this;
    }

    public function getCod_cliente(){
        return $this->cod_cliente;
    }
    
    public function setCod_cliente($cod_cliente){
        $this->cod_cliente = $cod_cliente;
        return $this;
    }

    public function getCod_zona(){
        return $this->cod_zona;
    }
    
    public function setCod_zona($cod_zona){
        $this->cod_zona = $cod_zona;
        return $this;
    }

    public function llenarCB() {        
        try {
            $sql = "SELECT * FROM predio WHERE cod_cliente = :0";
            $resultado = $this->consultarFilas($sql,[$this->getCod_cliente()]);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }

    


}