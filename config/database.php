<?php

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule();

$capsule->AddConnection([
    'driver' => 'mysql',
    'host' => 'localhost',
    'username' => 'root',
    'database' => 'ready',
    'password' => 'tIAQKuzkAX4wsg0j',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci'
]);

$capsule->bootEloquent();