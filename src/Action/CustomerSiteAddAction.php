<?php

namespace App\Action;

use App\Domain\Customers\Service\CustomerSiteAdd;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class CustomerSiteAddAction
{
    private $customerSiteAdd;

    public function __construct(CustomerSiteAdd $customerSiteAdd)
    {
        $this->customerSiteAdd = $customerSiteAdd;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->customerSiteAdd->createCustomerSite($formDetails);

        $response->getBody()->write((string)json_encode($returnData));

        //$response = $formDetails;

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}
