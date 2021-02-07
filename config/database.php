<?php

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule();

$capsule->AddConnection([
    'driver' => 'mysql',
    'host' => 'localhost',
    'username' => 'root',
    'database' => 'ready',
    'password' => 'TekTools!001',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci'
]);

$capsule->bootEloquent();