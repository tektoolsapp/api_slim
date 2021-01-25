<?php

namespace App\Action;

use App\Domain\Scheduler\Service\SchedulerFilter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class SchedulerFilterAction
{
    private $schedulerFilter;
    private $twig;

    public function __construct(SchedulerFilter $schedulerFilter, Twig $twig)
    {
        $this->schedulerFilter = $schedulerFilter;
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response,
        array $args = []
    ): ResponseInterface {

        //dump($args);

        $params = $request->getQueryParams();

        //dump($params);

        if($params['form'] == 'all'){
            $filter = 'all';
        } else {
            extract($params);
            parse_str($form, $filterArray);
            //turn it into a filter array
            $filter = array();
            foreach ($filterArray as $value) {
                $filter[] = $value;
            }
        }

        //dump($filter);

        $schedulerData = $this->schedulerFilter->getResources($filter);

        $response->getBody()->write((string)json_encode($schedulerData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }
}