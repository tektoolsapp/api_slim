<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomerSiteFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class CustomerSiteFetchAction
{
    private $customerSiteFetch;
    private $twig;

    public function __construct(CustomerSiteFetch $customerSiteFetch, Twig $twig)
    {
        $this->customerSiteFetch = $customerSiteFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $customerSiteId = (int)$args['site_id'];

        $customerSiteData = $this->customerSiteFetch->getCustomerSite($customerSiteId);

        $response->getBody()->write((string)json_encode($customerSiteData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}