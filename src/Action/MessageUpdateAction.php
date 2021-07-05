<?php

namespace App\Action;

use App\Domain\Messages\Service\MessageUpdate;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class MessageUpdateAction
{
    private $messageUpdate;
    private $twig;

    public function __construct(
        MessageUpdate $messageUpdate,
        Twig $twig
        )
    {
        $this->messageUpdate = $messageUpdate;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        
        $data = $request->getParsedBody();

        //extract($data);
        //parse_str($form, $formDetails);

        //dump($formDetails);

        $returnData = $this->messageUpdate->updateMessage($data);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
          
}