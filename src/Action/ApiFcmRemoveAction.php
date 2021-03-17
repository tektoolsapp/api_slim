<?php

namespace App\Action;

use App\Domain\Api\Service\ApiFcmRemove;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class ApiFcmRemoveAction
{
    private $apiFcmRemove;

    public function __construct(
            ApiFcmRemove $apiFcmRemove
        )
    {
        $this->apiFcmRemove = $apiFcmRemove;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        
        $data = $request->getParsedBody();

        //extract($data);
        //parse_str($form, $formDetails);
        dump($data);

        $returnData = $this->apiFcmRemove->removeMessage($data);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
          
}