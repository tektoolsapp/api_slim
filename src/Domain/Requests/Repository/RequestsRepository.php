<?php

namespace App\Domain\Requests\Repository;

use App\Domain\Customers\Repository\CustomerSitesAllFetchRepository;
use App\Domain\Employees\Repository\TradesRepository;
use App\Domain\Requests\Repository\RequestShiftFetchRepository;
use App\Domain\Utility\Service\CommonFunctions;
use PDO;

class RequestsRepository
{
    private $connection;
    private $allSites;
    private $trades;
    private $reqCums;
    private $common;

    public function __construct(
            PDO $connection,
            CustomerSitesAllFetchRepository $allSites,
            TradesRepository $trades,
            RequestShiftFetchRepository $reqCums,
            CommonFunctions $common
        )
    {
        $this->connection = $connection;
        $this->allSites = $allSites;
        $this->trades = $trades;
        $this->reqCums = $reqCums;
        $this->common = $common;
    }

    public function getRequests($page)
    {
        //dump($page);

        $tradesLookup = $this->trades->getTrades(); 
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
            
            $thisRequest = $requests[$r];

            //GET THE CUM MESSAGE VALUES
            $thisRequestId = $thisRequest['ws_id'];
            $reqShiftCums = $this->reqCums->getRequestShifts($thisRequestId);
            $requests[$r]['request_cums'] = $reqShiftCums;
            
            //SET TRADE TYPES DESC

            $tradeTypesArray = array();
            $subTradeType = array();

            foreach ($thisRequest as $key => $value){      
                //dump($key);
                if(substr($key,0,14) == 'ws_trade_type_'){
                    
                    $keyArray = explode("_",$key); 
                    $keyId = end($keyArray);
                    $tradeNumKey = 'ws_trade_num_' .$keyId;
                    //dump($tradeNumKey);
                    $tradeNums = $thisRequest[$tradeNumKey];
                    //dump($tradeNums);

                    //dump("K");
                    //dump($key);
                    //dump($value);
                    if($value != 'N'){
                        //$tradeTypesArray[] = $value;
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

            for ($t=0; $t < sizeof($tradeTypesArray); $t++) {
                $thisTrade = $tradeTypesArray[$t]['type'];
                $thisTradeNum = $tradeTypesArray[$t]['num'];
                $tradeDetails = $this->common->searchArray($tradesLookup, 'trade_code', $thisTrade);
                $tradeDesc = $tradeDetails[0]['trade_desc'];
                $tradeDescStr .= $tradeDesc."(".$thisTradeNum.")<br>";
            }

            $tradeDescStr = rtrim($tradeDescStr, '<br>');

            $requests[$r]['ws_trade_types'] = $tradeDescStr;
            
            $thisSiteCode = $requests[$r]['ws_site_dept'];
            $siteDetails = $this->common->searchArray($sitesLookup, 'site_code', $thisSiteCode);
            $siteDesc = $siteDetails[0]['site_desc'];
            $requests[$r]['ws_site_dept'] = $siteDesc;
            $siteShortDesc = $siteDetails[0]['site_short_desc'];
            $requests[$r]['ws_site_dept_short'] = $siteShortDesc;
        }

        //sleep(10);

        return $requests;
    }
}