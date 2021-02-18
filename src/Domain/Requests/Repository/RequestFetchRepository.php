<?php

namespace App\Domain\Requests\Repository;
use App\Domain\Customers\Repository\CustomersRepository;
use App\Domain\Customers\Repository\CustomerSitesAllFetchRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

use PDO;

class RequestFetchRepository
{
    private $customers;
    private $sites;
    private $trades;
    private $common;
    private $connection;

    public function __construct(
        CustomersRepository $customers,
        CustomerSitesAllFetchRepository $sites, 
        TradesRepository $trades, 
        CommonFunctions $common,  
        PDO $connection 
        )
    {
        $this->customers = $customers;
        $this->sites = $sites;
        $this->trades = $trades;
        $this->common = $common;
        $this->connection = $connection;
    }

    public function getRequest($wsId)
    {
        //dump($wsId);

        $customers = $this->customers->getCustomers();
        $sites = $this->sites->getAllCustomerSites();

        //dump($sites);

        $sql = "SELECT * FROM workspaces WHERE ws_id = :ws_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_id' => $wsId]);

        $request = $statement->fetch();

        //GET THE CUSTOMER DETS
        $customerCode = $request['ws_customer'];
        $customersLookup = $this->common->searchArray($customers, 'cust_id', $customerCode);
        $customerName = $customersLookup[0]['cust_name'];
        $request['ws_customer_name'] = $customerName;

        //GET THE SITE DETS
        $siteCode = $request['ws_site_dept'];
        $sitesLookup = $this->common->searchArray($sites, 'site_code', $siteCode);
        $siteDesc = $sitesLookup[0]['site_desc'];
        $siteShortDesc = $sitesLookup[0]['site_short_desc'];
        $request['ws_site_desc'] = $siteDesc;
        $request['ws_site_short_desc'] = $siteShortDesc;

        //dump($request);

        return $request;
    }
}