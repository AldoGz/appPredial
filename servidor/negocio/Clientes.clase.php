<?php

require_once '../acceso/Conexion.clase.php';

class Clientes extends Conexion {
    private $cod_cliente;
    private $nombre;
    private $ruc;

    public function getCodigo_cliente(){
        return $this->cod_cliente;
    }
    
    public function setCodigo_cliente($cod_cliente){
        $this->cod_cliente = $cod_cliente;
        return $this;
    }

    public function getNombre(){
        return $this->nombre;
    }
    
    public function setNombre($nombre){
        $this->nombre = $nombre;
        return $this;
    }    

    public function getRuc(){
        return $this->ruc;
    }
    
    public function setRuc($ruc){
        $this->ruc = $ruc;
        return $this;
    }

    public function llenarCB() {        
        try {
            $sql = "SELECT * FROM cliente";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }

    


}