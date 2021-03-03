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

    $app->add(new Tuupola\Middleware\JwtAuthentication([
        "secure" -> true,
        "relaxed" => ["localhost", "rr.ttsite.com.au"],
        "ignore"=> ["/api/signin"],
        //"ignore"=> ["/api"],
        "path" => "/api", /* or ["/api", "/admin"] */
        "secret" => $_SERVER['JWT_SECRET'],
        "error"=>function($response,$arguments)
          {
              $data["success"] = false;
              $data["response"]=$arguments["message"];
              $data["status_code"]= "401";

              return $response->withHeader("Content-type","application/json")
                  ->getBody()->write(json_encode($data,JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT ));
          }
    ]));

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