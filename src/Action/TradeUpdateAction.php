<?php

namespace App\Action;

use App\Domain\Employees\Service\TradeUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class TradeUpdateAction
{
    private $tradeUpdate;

    public function __construct(TradeUpdate $tradeUpdate)
    {
        $this->tradeUpdate = $tradeUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->tradeUpdate->updateTrade($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
