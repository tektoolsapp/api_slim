<?php

namespace App\Domain\Requests\Repository;

use App\Domain\Customers\Repository\CustomerSitesAllFetchRepository;
use App\Domain\Utility\Service\CommonFunctions;
use PDO;
//use MongoDB\Client as Mongo;


class RequestsRepository
{
    private $connection;
    //private $mongo;
    private $allSites;
    private $common;

    public function __construct(
            PDO $connection,
            //Mongo $mongo,
            CustomerSitesAllFetchRepository $allSites,
            CommonFunctions $common
        )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;
        $this->allSites = $allSites;
        $this->common = $common;
    }

    public function getRequests($page)
    {
        //dump($page);

        $sitesLookup = $this->allSites->getAllCustomerSites();

        $limit = 100;

        if (isset($page)) {
            $page_no = $page;
        }else{
            $page_no = 1;
        }

        $offset = ($page_no-1) * $limit;

        $sql = "SELECT * FROM workspaces WHERE ws_type = 'request'
            LIMIT $offset, $limit";
        $statement = $this->connection->prepare($sql);
        $statement->execute();

        $requests = $statement->fetchAll(PDO::FETCH_ASSOC);

        for ($r=0; $r < sizeof($requests); $r++) {
            $thisSiteCode = $requests[$r]['ws_site_dept'];
            $siteDetails = $this->common->searchArray($sitesLookup, 'site_code', $thisSiteCode);
            $siteDesc = $siteDetails[0]['site_desc'];
            $requests[$r]['ws_site_dept'] = $siteDesc;
        }

        return $requests;
    }
}