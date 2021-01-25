<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomersList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class CustomersAction
{
    private $customersList;
    private $twig;

    public function __construct(CustomersList $customersList, Twig $twig)
    {
        $this->customersList = $customersList;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $customersData = $this->customersList->getCustomers();

        $response->getBody()->write((string)json_encode($customersData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}