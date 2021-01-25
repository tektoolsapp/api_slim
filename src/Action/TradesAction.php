<?php

namespace App\Action;

use App\Domain\Employees\Service\TradesList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class TradesAction
{
    private $tradesList;
    private $twig;

    public function __construct(TradesList $tradesList, Twig $twig)
    {
        $this->tradesList = $tradesList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $tradesData = $this->tradesList->getTrades();

        $response->getBody()->write((string)json_encode($tradesData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}