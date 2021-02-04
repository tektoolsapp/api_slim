<?php

namespace App\Action;

use Cartalyst\Sentinel\Native\Facades\Sentinel;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
//use Slim\Interfaces\RouteParserInterface;
//use Psr\Http\Message\RequestInterface;
use Slim\Views\Twig;
use Slim\Flash\Messages as Flash;

final class UserSigninIndexAction
{
    //private $routeParser;
    private $twig;
    private $flash;

    public function __construct(Twig $twig, Flash $flash)
    {
        //$this->routeParser = $routeParser;
        $this->twig = $twig;
        $this->flash = $flash;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        if (Sentinel::guest()) {

            $this->flash->addMessage('status', 'Please sign in before continuing');

            return $this->twig->render($response, 'layout/auth/signin.twig', array(
                'title'=> 'SIGN IN',
                'redirect' => $request->getQueryParams()['redirect'] ?? null
            ));

        } else {

            return $this->twig->render($response, 'layout/content/dashboard.twig', array(
                'title'=> 'SIGN IN',
                'redirect' => $request->getQueryParams()['redirect'] ?? null
            ));

        }

    }
}