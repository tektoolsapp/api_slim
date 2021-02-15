<?php

namespace App\Domain\Requests\Repository;

use PDO;
use App\Domain\Customers\Repository\CustomerSiteFetchRepository;

class RequestSchedulerRawRepository
{
    private $connection;
    private $site;

    public function __construct(
            PDO $connection, 
            CustomerSiteFetchRepository $site
        )
    {
        $this->connection = $connection;
        $this->site = $site;
    }

    public function getRequest($request)
    {
        $sql = "SELECT ws_id, ws_ref, ws_site_dept FROM workspaces WHERE ws_id = :ws_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_id' => $request]);

        $request = $statement->fetch();

        //REPLACE SITE CODE WITH DESC
        $siteCode = $request['ws_site_dept'];
        $siteDesc = $this->site->getCustomerSite($siteCode);
        $request['ws_site_dept'] = $siteDesc['site_short_desc'];

        return $request;
    }
}