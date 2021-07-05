<?php

namespace App\Action;

use App\Domain\Employees\Service\TradeAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class TradeAddAction
{
    private $tradeAdd;

    public function __construct(TradeAdd $tradeAdd)
    {
        $this->tradeAdd = $tradeAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        dump($formDetails);

        $returnData = $this->tradeAdd->createTrade($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
