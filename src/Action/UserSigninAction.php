<?php

namespace App\Action;

use Slim\Interfaces\RouteParserInterface;
use Cartalyst\Sentinel\Native\Facades\Sentinel;
use Slim\Flash\Messages;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

use App\Util\Util;

final class UserSignInAction extends Util
{

    private $twig;
    private $flash;

    public function __construct(Twig $twig, Messages $flash, RouteParserInterface $routeParser)
    {
        $this->twig = $twig;
        $this->flash = $flash;
        $this->routeParser = $routeParser;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $data = $this->validate($request, [
           'username' => ['required'],
           'password' => ['required']
        ]);

        //dump($data);

        /*
        $credentials = [
            'username' => $data['username'],
            'password' => $data['password'],
        ];
        */

        //dump($credentials);

        try {

            if(!$user = Sentinel::authenticate($data, isset($data['persist']))){
                //die("Incorrect Credentials");
                throw new \Exception('Incorrect Username or Password');
            }

        } catch(\Throwable $exception){
            $this->flash->addMessage('status', $exception->getMessage());

            return $response
                ->withHeader('Location', $this->routeParser->urlFor('user-signin'));
        }

        //dump($user);

        /*if($redirect = $data['redirect']){
            return $response
                ->withHeader('Location', $redirect);
        }*/

        return $response
            ->withHeader('Location', $data['redirect'] ? $data['redirect'] : $this->routeParser->urlFor('dashboard'));

    }
}