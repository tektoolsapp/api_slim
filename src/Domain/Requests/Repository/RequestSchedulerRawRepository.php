<?php

namespace App\Domain\Requests\Repository;
use PDO;
use App\Domain\Customers\Repository\CustomerSiteFetchRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class RequestSchedulerRawRepository
{
    private $connection;
    private $site;
    private $trades;
    private $common;

    public function __construct(
            PDO $connection, 
            CustomerSiteFetchRepository $site,
            TradesRepository $trades,
            CommonFunctions $common 
        )
    {
        $this->connection = $connection;
        $this->site = $site;
        $this->trades = $trades;
        $this->common = $common;
    }

    public function getRequest($request)
    {
        
        $trades = $this->trades->getTrades();

        $sql = "SELECT 
            ws_id, 
            ws_ref, 
            ws_site_dept,
            ws_trade_type_1,
            ws_trade_type_2,
            ws_trade_type_3
        FROM workspaces WHERE ws_id = :ws_id;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_id' => $request]);

        $request = $statement->fetch();

        //CREATE AN ARRAY OF TRADE TYPES
        $tradeTypesArray = array();
        $tradeTypesSelectionArray = array();
        $selectionArray = array();

        foreach ($request as $key => $value){      
            //dump($key);
            if(substr($key,0,13) == 'ws_trade_type'){
                //dump("K");
                //dump($key);
                //dump($value);
                if($value != 'N'){
                    $tradeTypesArray[] = $value;
                }

                if($value != 'N'){
                    
                    $tradesLookup = $this->common->searchArray($trades, 'trade_code', $value);
                    $tradeDesc = $tradesLookup[0]['trade_desc'];
                    
                    $selectionArray = array(
                        "code" => $value,
                        "desc" => $tradeDesc
                    );

                    array_push($tradeTypesSelectionArray,$selectionArray);
                    $selectionArray = array();
                }

            }

        }
        //REPLACE SITE CODE WITH DESC
        $siteCode = $request['ws_site_dept'];
        $siteDesc = $this->site->getCustomerSite($siteCode);
        $request['ws_site_dept'] = $siteDesc['site_short_desc'];

        unset($request['ws_trade_type_1']);
        unset($request['ws_trade_type_2']);
        unset($request['ws_trade_type_3']);

        $request['ws_trade_types'] = $tradeTypesArray;
        $request['ws_trade_types_selection'] = $tradeTypesSelectionArray;

        return $request;
    }
}