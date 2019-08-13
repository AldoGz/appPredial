<?php

session_name("_SERVICIO_WP_");
session_start();

unset($_SESSION["codigo_usuario"]);
unset($_SESSION["ruc"]);
unset($_SESSION["razon_social"]);
unset($_SESSION["representante_legal"]);
unset($_SESSION["direccion"]);
unset($_SESSION["correo"]);

session_destroy();

header("location:../../admin/vista/sesion/");