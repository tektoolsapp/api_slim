<?php

namespace App\Action;

use App\Domain\User\Service\UserList;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

/**
 * Action
 */
final class UserListAction
{
    /**
     * @var UserList
     */
    private $userReader;
    private $twig;

    /**
     * The constructor.
     *
     * @param UserList $userList The user reader
     */

    public function __construct(UserList $userList, Twig $twig)
    {
        $this->userList = $userList;
        $this->twig = $twig;
    }

    /**
     * Invoke.
     *
     * @param ServerRequestInterface $request The request
     * @param ResponseInterface $response The response
     * @param array $args The route arguments
     *
     * @return ResponseInterface The response
     */
    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {
        // Collect input from the HTTP request
        //$userId = (int)$args['id'];

        // Invoke the Domain with inputs and retain the result
        $userData = $this->userList->getUserList();

        //dump($userData);

        $result = [
            'title' => 'SCHEDULER',
        ];

        // Build the HTTP response
        //$response->getBody()->write((string)json_encode($result));
        //return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        return $this->twig->render($response, 'layout/content/middle.col.twig', $result);

    }
}