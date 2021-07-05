<?php

namespace App\Action;

use App\Domain\Utility\Service\EmpUpload;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class EmpUploadAction
{
    private $empUpload;
    private $twig;

    public function __construct(
            EmpUpload $empUpload, 
            Twig $twig
        )
    {
        $this->empUpload = $empUpload;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //$data = $request->getParsedBody();

        //extract($data);

        //$params = $request->getQueryParams();

        //dump($params);

        //$page = $params['page'];

        $empUpload = $this->empUpload->getEmpUpload();

        $response->getBody()->write((string)json_encode($empUpload));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);

    }
}