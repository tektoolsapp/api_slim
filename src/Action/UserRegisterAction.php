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

        $data = $request->getParsedBody();
        
        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $credentials = array();

        $credentials['email'] = $formDetails['email'];
        $credentials['username'] = $formDetails['username'];
        if(!empty($formDetails['password'])){
            dump("UPDATE PWD: ");
            dump($formDetails['password']);
            $credentials['password'] = $formDetails['password'];
        }
        $credentials['first_name'] = $formDetails['first_name'];
        $credentials['last_name'] = $formDetails['last_name'];

        $fullname = $formDetails['first_name']." ".$formDetails['last_name'];
        $initials = $this->generate($fullname);

        $credentials['initials'] = $initials;

        dump($credentials);

        Sentinel::register($credentials, true);

       /*  Sentinel::register([
            'username' => 'allanhyde',
            'email' => 'allan.hyde@livepages.com.au',
            'password' => 'password',
            'first_name' => 'Allan',
            'last_name' => 'Hyde',
            'initials' => 'AH'
        ], true); */

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }

    public function generate(string $fullname) : string
    {
        
        $words = explode(' ', $fullname);
        
        $initialsStr = '';
        
        for ($w=0; $w < sizeof($words); $w++) {
            $initial = strtoupper(substr($words[$w], 0, 1));
            $initialsStr .= $initial."";
        }

        return $initialsStr;
    }
}