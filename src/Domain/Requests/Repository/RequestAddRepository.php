<?php

namespace App\Domain\Requests\Repository;

use PDO;

class RequestAddRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function insertRequest(array $request)
    {
        unset($request['ws_id']);
        unset($request['ws_customer_name']);

        $request['ws_quote_pdfs'] = '';
        $request['ws_pdf_chf_fields'] = '';
        $request['ws_pdf_sef_fields'] = '';
        $request['ws_count_sef_pdfs'] = '';
        $request['ws_pdf_chf '] = '';

        $ref = mt_rand(1000000,9999999);
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
