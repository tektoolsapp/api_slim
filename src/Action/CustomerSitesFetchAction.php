<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomerSitesFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class CustomerSitesFetchAction
{
    private $customerSitesFetch;
    private $twig;

    public function __construct(CustomerSitesFetch $customerSitesFetch, Twig $twig)
    {
        $this->customerSitesFetch = $customerSitesFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $customerSitesId = (int)$args['cust_id'];

        $customerSitesData = $this->customerSitesFetch->getCustomerSites($customerSitesId);

        $response->getBody()->write((string)json_encode($customerSitesData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}