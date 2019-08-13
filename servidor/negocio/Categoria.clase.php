<?php

require_once '../acceso/Conexion.clase.php';

class Categoria extends Conexion {
    private $codigo_categoria;
    private $nombre;
    private $abreviatura;
    private $estado;

    public function getCodigo_categoria(){
       return $this->codigo_categoria;
   }
   
   public function setCodigo_categoria($codigo_categoria){
       $this->codigo_categoria = $codigo_categoria;
       return $this;
   }

    public function getNombre(){
        return $this->nombre;
    }
    
    public function setNombre($nombre){
        $this->nombre = $nombre;
        return $this;
    }

    public function getAbreviatura(){
        return $this->abreviatura;
    }
    
    public function setAbreviatura($abreviatura){
        $this->abreviatura = $abreviatura;
        return $this;
    }

    public function getEstado(){
        return $this->estado;
    }
    
    public function setEstado($estado){
        $this->estado = $estado;
        return $this;
    }

    public function agregar() {
        session_name("_SERVICIO_WP_");
        session_start();
        $this->beginTransaction();
        try {            
            $campos_valores = [
                "nombre"=>strtoupper($this->getNombre()),
                "abreviatura"=>strtoupper($this->getAbreviatura()),
                "codigo_empresa"=>$_SESSION["codigo_usuario"]
            ];            

            $this->insert("categoria", $campos_valores);
            $this->commit();
            return array("rpt"=>true,"msj"=>"Se agregado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->rollBack();
            throw $exc;
        }
    }

    public function editar() {
        session_name("_SERVICIO_WP_");
        session_start();
        $this->beginTransaction();
        try { 
            $campos_valores = [
                "nombre"=>strtoupper($this->getNombre()),
                "abreviatura"=>strtoupper($this->getAbreviatura()),
                "codigo_empresa"=>$_SESSION["codigo_usuario"]
            ]; 

            $campos_valores_where = [
                "codigo_categoria"=>$this->getCodigo_categoria()
            ];

            $this->update("categoria", $campos_valores,$campos_valores_where);
            $this->commit();
            return array("rpt"=>true,"msj"=>"Se actualizado exitosamente");
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->rollBack();
            throw $exc;
        }
    }

    public function listar() {
        session_name("_SERVICIO_WP_");
        session_start();
        try {
            $sql = "SELECT * FROM categoria WHERE estado = :0 AND codigo_empresa = :1";
            $resultado = $this->consultarFilas($sql,[$this->getEstado(),$_SESSION["codigo_usuario"]]);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }

    public function leerDatos() {
        try {
            $sql = "SELECT * FROM categoria WHERE codigo_categoria =:0";
            $resultado = $this->consultarFila($sql,[$this->getCodigo_categoria()]);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }

    public function darBaja() {
        $this->beginTransaction();
        try {
            $texto = $this->getEstado() != '1' ? 
                'Se inactivado existosamente' : 'Se activado existosamente';
            
            $campos_valores = [
                "estado"=>$this->getEstado()
            ];

            $campos_valores_where = [
                "codigo_categoria"=>$this->getCodigo_categoria()
            ];

            $this->update("categoria", $campos_valores,$campos_valores_where);
            $this->commit();
            return array("rpt"=>true,"msj"=>$texto);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            $this->rollBack();
            throw $exc;
        }
    }

    public function llenarCB() {
        try {
            $sql = "SELECT * FROM categoria WHERE estado = 1";
            $resultado = $this->consultarFilas($sql);
            return array("rpt"=>true,"msj"=>$resultado);
        } catch (Exception $exc) {
            return array("rpt"=>false,"msj"=>$exc);
            throw $exc;
        }
    }


}