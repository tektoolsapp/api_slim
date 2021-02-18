<?php

namespace App\Action;

use App\Domain\Utility\Service\EmailSend;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class EmailSendAction
{
    private $emailSend;
    private $twig;

    public function __construct(EmailSend $emailSend, Twig $twig)
    {
        $this->emailSend = $emailSend;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $reqId = $args['req_id'];
        
        $pdf = $this->emailSend->sendEmail($reqId);

        $response->getBody()->write((string)json_encode($pdf));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}