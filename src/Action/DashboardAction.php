<?php

namespace App\Action;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class DashboardAction
{
    private $twig;

    public function __construct(Twig $twig)
    {
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $myVar = $_SERVER['JWT_SECRET'];
        
        return $this->twig->render($response, 'layout/content/dashboard.twig', array(
            'title'=> 'DASHBOARD',
            'secret' => $myVar
        ));
    }
}
