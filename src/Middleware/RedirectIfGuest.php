<?php

namespace App\Middleware;

use Slim\Flash\Messages;
use Psr\Http\Message\RequestInterface;
use Slim\Interfaces\RouteParserInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Cartalyst\Sentinel\Native\Facades\Sentinel;

class RedirectIfGuest
{
    protected $flash;
    protected $routeParser;

    public function __construct(Messages $flash, RouteParserInterface $routeParser)
    {
        $this->flash = $flash;
        $this->routeParser = $routeParser;
    }

    public function __invoke(RequestInterface $request, RequestHandlerInterface $handler)
    {
        $response = $handler->handle($request);

        if (Sentinel::guest()) {
            $this->flash->addMessage('status', 'Please sign in before continuing');

            /*$response = $response
                ->withHeader(
                    'Location', $this->routeParser->urlFor('user-signin-index')
                );*/


            $response = $response
                ->withHeader(
                    'Location',
                    $this->routeParser->urlFor('user-signin-index').
                    '?' .
                    http_build_query(['redirect' => $request->getUri()->getPath()])
                );

        }

        return $response;
    }
}
