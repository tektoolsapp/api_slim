<?php

namespace App\Action;

use App\Domain\Messages\Service\FcmFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class FcmFetchAction
{
    private $fcmFetch;
    private $twig;

    public function __construct(FcmFetch $fcmFetch, Twig $twig)
    {
        $this->fcmFetch = $fcmFetch;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $messageTo = (int)$args['message_to'];

        //dump($messageTo);

        $messages = $this->fcmFetch->getMessages($messageTo);

        $response->getBody()->write((string)json_encode($messages));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}