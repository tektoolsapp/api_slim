<?php

namespace App\Action;

use App\Domain\Utility\Service\EmailConfirm;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class EmailConfirmAction
{
    private $emailConfirm;
    private $twig;

    public function __construct(EmailConfirm $emailConfirm, Twig $twig)
    {
        $this->emailConfirm = $emailConfirm;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //$reqId = $args['req_id'];

        $data = $request->getParsedBody();

        extract($data);
        parse_str($form, $formDetails);

        dump($formDetails);

        $pdf = $this->emailConfirm->sendConfirmationEmail($formDetails);

        $response->getBody()->write((string)json_encode($pdf));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}