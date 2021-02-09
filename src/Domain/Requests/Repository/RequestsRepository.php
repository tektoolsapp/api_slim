<?php

namespace App\Domain\Requests\Repository;

use App\Domain\Customers\Repository\CustomerSitesAllFetchRepository;
use App\Domain\Utility\Service\CommonFunctions;
use PDO;

class RequestsRepository
{
    private $connection;
    private $allSites;
    private $common;

    public function __construct(
            PDO $connection,
            CustomerSitesAllFetchRepository $allSites,
            CommonFunctions $common
        )
    {
        $this->connection = $connection;
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
            $siteShortDesc = $siteDetails[0]['site_short_desc'];
            $requests[$r]['ws_site_dept_short'] = $siteShortDesc;
        }

        return $requests;
    }
}