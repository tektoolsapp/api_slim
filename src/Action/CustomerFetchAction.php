<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomerFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class CustomerFetchAction
{
    private $customerFetch;
    private $twig;

    public function __construct(CustomerFetch $customerFetch, Twig $twig)
    {
        $this->customerFetch = $customerFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $customerId = (int)$args['cust_id'];

        $customerData = $this->customerFetch->getCustomer($customerId);

        $response->getBody()->write((string)json_encode($customerData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}