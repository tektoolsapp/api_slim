<?php

namespace App\Middleware;

use Slim\Psr7\Response;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Psr\Http\Message\ResponseFactoryInterface;
use App\Views\CsrfExtension;
use Slim\Csrf\Guard;

class CsfrExtensionMiddleware
{

    private $responseFactory;

    public function __construct(ResponseFactoryInterface $responseFactory)
    {
        $this->responseFactory = $responseFactory;
    }

    public function __invoke(RequestInterface $request, RequestHandlerInterface $handler)
    {

        $response = $handler->handle($request);

        //$this->csfr->csrf();

        $csfr = new CsrfExtension(new Guard($this->responseFactory));

        $csfr->csrf();

        //dump('running');

        //$response = new Response();

        return $handler->handle($request);
    }
}