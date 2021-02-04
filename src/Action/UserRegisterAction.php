<?php

namespace App\Action;

//use App\Domain\Employees\Service\UserRegister;

use Cartalyst\Sentinel\Native\Facades\Sentinel;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class UserRegisterAction
{
    //private $userRegistersList;
    private $twig;

    public function __construct(Twig $twig)
    {
        //$this->userRegistersList = $userRegistersList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        /*
        $userRegistersData = $this->userRegistersList->getUserRegisters();

        $response->getBody()->write((string)json_encode($userRegistersData));



        */

        Sentinel::register([
            'username' => 'allanhyde',
            'email' => 'allan.hyde@livepages.com.au',
            'password' => 'password',
            'first_name' => 'Allan',
            'last_name' => 'Hyde',
            'initials' => 'AH'
        ], true);

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);



    }
}