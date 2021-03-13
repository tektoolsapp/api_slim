<?php

namespace App\Action;

//use App\Domain\Api\Service\ApiTestUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class ApiTestUpdateAction
{
    //private $apiTestUpdate;

    public function __construct(
            //ApiTestUpdate $apiTestUpdate
        )
    {
        //$this->apiTestUpdate = $apiTestUpdate;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        //$data = $request->getParsedBody();

        $uploadedFiles = $request->getUploadedFiles();

        dump("here");

        dump($uploadedFiles);

        die;

        //extract($data);
        //parse_str($form, $formDetails);

        //dump($formDetails);

        //$returnData = $this->apiTestUpdate->updateTest($data);

        //$returnData = $data;

        /* $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
            */ 
    }
}
