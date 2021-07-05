<?php

namespace App\Action;

use App\Domain\Employees\Service\TradeFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class TradeFetchAction
{
    private $tradeFetch;
    private $twig;

    public function __construct(TradeFetch $tradeFetch, Twig $twig)
    {
        $this->tradeFetch = $tradeFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $tradeId = (int)$args['trade_id'];

        //dump($tradeId);

        $tradeData = $this->tradeFetch->getTrade($tradeId);

        $response->getBody()->write((string)json_encode($tradeData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}