<?php

// File Security Check
if(!defined('ABSPATH')) { exit; }

function lotto_yard_spl_autoload_register($class)
{
    $prefix = 'Lotto_Yard';
    if (stripos($class, $prefix) === false) {
        return;
    }
    
    $file_path = dirname(__FILE__) . DIRECTORY_SEPARATOR . str_ireplace('Lotto_Yard\\', '', $class) . '.php';
    
    $file_path = str_replace('\\', DIRECTORY_SEPARATOR, $file_path);
    include_once($file_path);
}

spl_autoload_register('lotto_yard_spl_autoload_register');

include_once(__DIR__ . '/LottoYardAppIndex.php');