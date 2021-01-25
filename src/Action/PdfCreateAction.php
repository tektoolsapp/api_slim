<?php

namespace App\Action;

use App\Domain\Utility\Service\PdfCreate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class PdfCreateAction
{
    private $pdfCreate;
    private $twig;

    public function __construct(PdfCreate $pdfCreate, Twig $twig)
    {
        $this->pdfCreate = $pdfCreate;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $pdf = $this->pdfCreate->createPdf();

        $response->getBody()->write((string)json_encode($pdf));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}