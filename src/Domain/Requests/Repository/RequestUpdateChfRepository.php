<?php

namespace App\Domain\Requests\Repository;

use PDO;
use App\Domain\Utility\Service\PdoInsert;

class RequestUpdateChfRepository
{
    private $connection;
    private $pdoInsert;

    public function __construct(PDO $connection, PdoInsert $pdoInsert)
    {
        $this->connection = $connection;
        $this->pdoInsert = $pdoInsert;
    }

    public function updateRequest(
        $wsId,
        array $empPdfArray,
        array $chfFieldsArray,
        array $sefFieldsArray,
        array $updateRioPdfs,
        $sefPdfCounter
        )
    {
        $empPdfJson = json_encode($empPdfArray);
        $chfFieldsJson = json_encode($chfFieldsArray);
        $sefFieldsJson = json_encode($sefFieldsArray);
        $rioPdfsJson  = json_encode($updateRioPdfs);

        $sql = "UPDATE workspaces SET
            ws_pdf_chf = :ws_pdf_chf,
            ws_pdf_chf_fields = :ws_pdf_chf_fields,
            ws_pdf_sef_fields = :ws_pdf_sef_fields,
            ws_count_sef_pdfs = :ws_count_sef_pdfs,
            ws_quote_pdfs = :ws_quote_pdfs
        WHERE
            ws_id = :ws_id
        ";
        $statement = $this->connection->prepare($sql);
        $statement->execute([
            'ws_pdf_chf' => $empPdfJson,
            'ws_pdf_chf_fields' => $chfFieldsJson,
            'ws_pdf_sef_fields' => $sefFieldsJson,
            'ws_count_sef_pdfs' => $sefPdfCounter,
            'ws_quote_pdfs' => $rioPdfsJson,
            'ws_id' => $wsId,
        ]);

        return 'OK';

    }
}
