<?php

namespace App\Action;

use Cartalyst\Sentinel\Native\Facades\Sentinel;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class UserUpdateAction
{
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

        //dump($args);
        
        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $credentials = array();

        $credentials['email'] = $formDetails['email'];
        $credentials['username'] = $formDetails['username'];
        if(!empty($formDetails['password'])){
            //dump("UPDATE PWD: ");
            $credentials['password'] = $formDetails['password'];
        }
        $credentials['first_name'] = $formDetails['first_name'];
        $credentials['last_name'] = $formDetails['last_name'];

        $fullname = $formDetails['first_name']." ".$formDetails['last_name'];
        $initials = $this->generate($fullname);

        //dump($fullname);

        $credentials['initials'] = $initials;

        //dump("CRED");
        //dump($credentials);
        
        $id = $args['id'];
        $user = Sentinel::findById($id);

        //dump($user);

        $user = Sentinel::update($user, $credentials);
        
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