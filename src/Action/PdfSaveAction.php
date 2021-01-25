<?php

namespace App\Action;

use App\Domain\Utility\Service\PdfSave;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class PdfSaveAction
{
    private $pdfSave;
    private $twig;

    public function __construct(PdfSave $pdfSave, Twig $twig)
    {
        $this->pdfSave = $pdfSave;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $data = $request->getParsedBody();

        //dump($data);

        $pdf = $this->pdfSave->savePdf($data);

        $response->getBody()->write((string)json_encode($pdf));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}