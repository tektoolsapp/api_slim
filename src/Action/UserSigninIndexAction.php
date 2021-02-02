<?php

namespace App\Action;

//use Cartalyst\Sentinel\Native\Facades\Sentinel;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class UserSigninIndexAction
{
    //private $userRegistersList;
    private $twig;

    public function __construct(Twig $twig)
    {
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        return $this->twig->render($response, 'layout/auth/signin.twig', array(
            'title'=> 'SIGN IN',
            'redirect' => $request->getQueryParams()['redirect'] ?? null
        ));

    }
}