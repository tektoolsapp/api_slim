<?php

use App\Exceptions\ExceptionHandler;
use Slim\Flash\Messages as Flash;

$errorMiddleware = $app->addErrorMiddleware(true, true, true);

$errorMiddleware->setDefaultErrorHandler(
    new ExceptionHandler(
        $container->get(Flash::class),
        $app->getResponseFactory()
    )
);