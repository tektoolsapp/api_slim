<?php

use Slim\App;
use Selective\BasePath\BasePathMiddleware;
use Slim\Middleware\ErrorMiddleware;
use Slim\Views\TwigMiddleware;
use Selective\Validation\Middleware\ValidationExceptionMiddleware;
use Slim\Csrf\Guard;

//use Selective\SameSiteCookie\SameSiteCookieConfiguration;
//use Selective\SameSiteCookie\SameSiteCookieMiddleware;
//use Selective\SameSiteCookie\SameSiteSessionMiddleware;
//use Slim\Factory\AppFactory;

return function (App $app) {

    //$configuration = new SameSiteCookieConfiguration();
    //$app->add(new SameSiteCookieMiddleware($configuration));

    //$app->add(Guard::class);

    // Parse json, form data and xml
    $app->addBodyParsingMiddleware();

    $app->add(TwigMiddleware::class);

    // Add the Slim built-in routing middleware
    $app->addRoutingMiddleware();

    $app->add(BasePathMiddleware::class);

    // Catch exceptions and errors
    $app->add(ErrorMiddleware::class);

    $app->add(ValidationExceptionMiddleware::class);
};