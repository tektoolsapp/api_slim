<?php

namespace App\Action;

use App\Domain\Utility\Service\PdfFields;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class PdfFieldsAction
{
    private $pdfFields;
    private $twig;

    public function __construct(PdfFields $pdfFields, Twig $twig)
    {
        $this->pdfFields = $pdfFields;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $pdf = $args['pdf'];

        $req = $args['req'];

        $fields = $this->pdfFields->getPdfFields($req,$pdf);

        $response->getBody()->write((string)json_encode($fields));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}