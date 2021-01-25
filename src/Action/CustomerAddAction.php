<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomerAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class CustomerAddAction
{
    private $customerAdd;

    public function __construct(CustomerAdd $customerAdd)
    {
        $this->customerAdd = $customerAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        dump($formDetails);

        $returnData = $this->customerAdd->createCustomer($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
