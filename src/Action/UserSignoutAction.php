<?php

namespace App\Action;

use Slim\Interfaces\RouteParserInterface;
use Cartalyst\Sentinel\Native\Facades\Sentinel;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class UserSignoutAction
{
    private $routeParser;

    public function __construct(RouteParserInterface $routeParser)
    {
        $this->routeParser = $routeParser;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        Sentinel::logout();

        return $response
            ->withHeader('Location', $this->routeParser->urlFor('user-signin-index'));
    }
}