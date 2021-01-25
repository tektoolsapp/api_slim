<?php

namespace App\Action;

use App\Domain\Utility\Service\PdfQuote;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class PdfQuoteAction
{
    private $pdfQuote;
    private $twig;

    public function __construct(PdfQuote $pdfQuote, Twig $twig)
    {
        $this->pdfQuote = $pdfQuote;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $data = $request->getParsedBody();

        //dump($data);

        $pdf = $this->pdfQuote->quotePdf($data);

        $response->getBody()->write((string)json_encode($pdf));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}