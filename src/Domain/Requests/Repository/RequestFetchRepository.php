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
        $trades = $this->trades->getTrades();

        //dump($sites);

        $sql = "SELECT * FROM workspaces WHERE ws_id = :ws_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_id' => $wsId]);

        $request = $statement->fetch();

        //GET THE TRADE TYPES
        
        $tradeTypesArray = array();
        $subTradeType = array();

        foreach ($request as $key => $value){      
            if(substr($key,0,14) == 'ws_trade_type_'){
                
                $keyArray = explode("_",$key); 
                $keyId = end($keyArray);
                $tradeNumKey = 'ws_trade_num_' .$keyId;
                $tradeNums = $request[$tradeNumKey];
                
                if($value != 'N'){
                    $subTradeType = array(
                        "type" => $value,
                        "num" => $tradeNums
                    );

                    array_push($tradeTypesArray,$subTradeType);
                    $subTradeType = array();
                }

            }

        }

        $tradeDescStr = '';

        for($t = 0; $t < sizeof($tradeTypesArray); $t++) {
            $thisTrade = $tradeTypesArray[$t]['type'];
            $thisTradeNum = $tradeTypesArray[$t]['num'];
            $tradesLookup = $this->common->searchArray($trades, 'trade_code', $thisTrade);
            $tradeDesc = $tradesLookup[0]['trade_desc'];
            $tradeDescStr .= $tradeDesc."(".$thisTradeNum.") / ";
        }

        $tradeDescStr = rtrim($tradeDescStr, ' / ');
        $request['ws_trades_desc'] = $tradeDescStr;
        $request['ws_trades_array'] = $tradeTypesArray;

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