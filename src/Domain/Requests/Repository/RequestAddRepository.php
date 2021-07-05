<?php

namespace App\Domain\Requests\Repository;

use PDO;
use App\Domain\Utility\Repository\RequestRefMaxRepository;
class RequestAddRepository
{
    private $connection;
    private $maxRef;

    public function __construct(PDO $connection, RequestRefMaxRepository $maxRef)
    {
        $this->connection = $connection;
        $this->maxRef = $maxRef;
    }

    public function insertRequest(array $request)
    {
        
        //dump($request);
        
        unset($request['ws_id']);
        //unset($request['ws_customer_name']);

        $request['ws_quote_pdfs'] = '';
        $request['ws_pdf_chf_fields'] = '';
        $request['ws_pdf_sef_fields'] = '';
        $request['ws_count_sef_pdfs'] = 0;
        $request['ws_pdf_chf '] = '';
        $request['ws_trade_types'] = '';
        $request['ws_trade_rates'] = '';

        $maxRef = $this->maxRef->getMaxRef();
        $maxRef = $maxRef[0];

        $ref = $maxRef + 1;

        //$ref = mt_rand(1000000,9999999);
        $request['ws_ref'] = $ref;

        $columnsArray = array_keys($request);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($request);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        $query = "INSERT INTO workspaces ($columnsString) VALUES ($valuesPlaceholder)";
        $this->connection->prepare($query)->execute($valuesArray);

        //return (int)$this->connection->lastInsertId();

        return 'OK';

    }
}
