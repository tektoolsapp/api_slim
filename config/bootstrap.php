<?php

use DI\ContainerBuilder;
use Dotenv\Dotenv;
use Slim\App;
use Cartalyst\Sentinel\Native\Facades\Sentinel;
use Cartalyst\Sentinel\Native\SentinelBootstrapper;

require_once __DIR__ . '/../vendor/autoload.php';


Sentinel::instance(
    new SentinelBootstrapper(
        require(__DIR__.'/../config/auth.php')
    )
);

// Register database
(require __DIR__ . '/database.php');

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

$containerBuilder = new ContainerBuilder();

// Set up settings
$containerBuilder->addDefinitions(__DIR__ . '/container.php');

// Build PHP-DI Container instance
$container = $containerBuilder->build();

// Create App instance
$app = $container->get(App::class);

// Register exceptions
require_once __DIR__ . '/exceptions.php';

// Register middleware
(require __DIR__ . '/middleware.php')($app);

// Register routes
(require __DIR__ . '/routes.php')($app);

return $app;

