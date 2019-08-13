<?php

require_once '../acceso/Conexion.clase.php';

class RealizarAutoevaluo extends Conexion {
    private $codigo_predio;
    private $anio_evaluacion;
    private $area_terreno;
    private $json_inmuebles;
    private $json_edificaciones;

    public function getCodigo_predio(){
        return $this->codigo_predio;
    }
    
    public function setCodigo_predio($codigo_predio){
        $this->codigo_predio = $codigo_predio;
        return $this;
    }

    public function getAnio_evaluacion(){
        return $this->anio_evaluacion;
    }
    
    public function setAnio_evaluacion($anio_evaluacion){
        $this->anio_evaluacion = $anio_evaluacion;
        return $this;
    }

    public function getArea_terreno(){
        return $this->area_terreno;
    }
    
    public function setArea_terreno($area_terreno){
        $this->area_terreno = $area_terreno;
        return $this;
    }

    public function getJson_inmuebles(){
        return $this->json_inmuebles;
    }
    
    public function setJson_inmuebles($json_inmuebles){
        $this->json_inmuebles = $json_inmuebles;
        return $this;
    }

    public function getJson_edificaciones(){
        return $this->json_edificaciones;
    }
    
    public function setJson_edificaciones($json_edificaciones){
        $this->json_edificaciones = $json_edificaciones;
        return $this;
    }

    public function insercion() {        
        try {
            $sql = "SELECT partida_registral FROM predio WHERE cod_predio = :0";            
            $pr = $this->consultarValor($sql,[$this->getCodigo_predio()]);

            $valores = [
                $pr,
                intval($this->getAnio_evaluacion()),
                floatval($this->getArea_terreno()),
                $this->getJson_inmuebles(),
                $this->getJson_edificaciones()
            ];

            $sql = "SELECT fn_calculo_autoavaluo(:0,:1,:2,:3,:4)";
            return json_decode($this->consultarFila($sql,$valores)["fn_calculo_autoavaluo"]);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }


}