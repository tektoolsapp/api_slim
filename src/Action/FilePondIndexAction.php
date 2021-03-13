<?php

namespace App\Action;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class FilePondIndexAction
{
    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        $template = __DIR__ . '/../../templates/filepond.html';
        $response->getBody()->write(file_get_contents($template));

        return $response;
    }
}