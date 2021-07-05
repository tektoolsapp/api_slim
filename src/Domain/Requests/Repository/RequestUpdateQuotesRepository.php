<?php

namespace App\Domain\Requests\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;

class RequestUpdateQuotesRepository
{
    private $connection;
    private $pdoInsert;

    public function __construct(PDO $connection, PdoInsert $pdoInsert)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
    }

    public function updateRequest($wsId, array $quotesPdfArray)
    {
        $quotesPdfJson = json_encode($quotesPdfArray);

        dump($wsId);
        dump($quotesPdfArray);

        $sql = "UPDATE workspaces SET ws_quote_pdfs = :ws_quote_pdfs WHERE ws_id = :ws_id";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['ws_quote_pdfs' => $quotesPdfJson, 'ws_id' => $wsId,] );

        return 'OK';

    }
}
