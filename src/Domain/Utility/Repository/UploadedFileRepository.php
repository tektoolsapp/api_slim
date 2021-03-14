<?php

namespace App\Domain\Utility\Repository;

use PDO;

class UploadedFileRepository
{
    private $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    public function insertUploadedFile($fileName)
    {
        
        $now = new \DateTime();
        $dateFormat = $now->format('Y-m-d H:i:s');    // MySQL datetime format
        dump($dateFormat);
        $uploadDate = $now->getTimestamp(); 
        
        $fileUpload = array(
            "upload_filename" => $fileName,
            "upload_type" => 'RR',
            "upload_date" => $uploadDate
        );

        $columnsArray = array_keys($fileUpload);
        $columnsString = implode(',', $columnsArray);
        $valuesArray = array_values($fileUpload);
        $valuesCount = count($valuesArray);

        $valuesPlaceholder = '';
        for ($i=0; $i < $valuesCount; $i++) {
            $valuesPlaceholder .= '?,';
        }
        $valuesPlaceholder = rtrim($valuesPlaceholder, ',');

        try {
            $query = "INSERT INTO uploaded_files ($columnsString) VALUES ($valuesPlaceholder)";
            $this->connection->prepare($query)->execute($valuesArray);
        } catch(\PDOException $e) {
            //die("Oh noes! There's an error in the query!");
        }

        //return (int)$this->connection->lastInsertId();

        if($e){
            $result = $e->getMessage();
            $responseCode = 400;
        } else {
            $result = "ok";
            $responseCode = 201;
        }

        $result = array(
            "status" => $responseCode,
            "payload" => array(
                "result" => $result
            )
        );

        dump($result);

        return $result;

    }
}
