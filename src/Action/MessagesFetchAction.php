<?php

namespace App\Action;

use App\Domain\Messages\Service\MessagesFetch;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class MessagesFetchAction
{
    private $MessagesFetch;
    private $twig;

    public function __construct(MessagesFetch $MessagesFetch)
    {
        $this->MessagesFetch = $MessagesFetch;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        $messageTo = (int)$args['message_to'];

        //dump($messageTo);
        
        $MessagesData = $this->MessagesFetch->getMessages($messageTo);

        $response->getBody()->write((string)json_encode($MessagesData));
        
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}