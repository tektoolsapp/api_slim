<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomerSiteUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class CustomerSiteUpdateAction
{
    private $customerSiteUpdate;

    public function __construct(CustomerSiteUpdate $customerSiteUpdate)
    {
        $this->customerSiteUpdate = $customerSiteUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->customerSiteUpdate->updateCustomerSite($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
