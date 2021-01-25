<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomerUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class CustomerUpdateAction
{
    private $customerUpdate;

    public function __construct(CustomerUpdate $customerUpdate)
    {
        $this->customerUpdate = $customerUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->customerUpdate->updateCustomer($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
