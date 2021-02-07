<?php

namespace App\Domain\Utility\Repository;

use PDO;
//use MongoDB\Client as Mongo;
use App\Domain\Requests\Repository\RequestFetchRepository;

class PdfFieldsRepository
{
    private $connection;
    //private $mongo;
    private $reqDets;

    public function __construct(
            PDO $connection, 
            //Mongo $mongo, 
            RequestFetchRepository $reqDets
        )
    {
        $this->connection = $connection;
        //$this->mongo = $mongo;
        $this->reqDets = $reqDets;
    }

    public function getPdfFields($req, $pdf)
    {
        //GET THE EMPLOYEES ARRAY

        $sql = "SELECT * FROM pdf_fields WHERE pdf_name = :pdf_name;";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['pdf_name' => $pdf]);

        $fields = $statement->fetchAll(PDO::FETCH_ASSOC);

        //GET THE REQUEST PDF FORM DETAILS FROM THE REQUEST

        if($pdf == 'CHF'){
            $request = $this->reqDets->getRequest($req);
            $empFields = $request['ws_pdf_chf_fields'];
            $empFieldsOuterArray = json_decode($empFields, true);
        } elseif($pdf == 'SEF'){
            $request = $this->reqDets->getRequest($req);
            $empFields = $request['ws_pdf_sef_fields'];
            $empFieldsOuterArray = json_decode($empFields, true);
        }

        //$empFieldsOuterArray = json_decode($empFields, true);

        $formFieldsArray = array();
        $formFieldsSubArray = array();

        for($o = 0; $o < sizeof($empFieldsOuterArray); $o++) {

            $thisEmp = $empFieldsOuterArray[$o][0]['emp_id'];

            //dump("THIS EMP: ".$thisEmp);

            $nextEmp = $empFieldsOuterArray[$o+1][0]['emp_id'];

            //dump("NEXT EMP: ".$nextEmp);

            $empFieldsArray = $empFieldsOuterArray[$o];

            for($e = 0; $e < sizeof($empFieldsArray); $e++) {

                $employee = $empFieldsArray[$e]['emp_id'];

                //dump("INNER EMP: ".$employee);

                $valuesArray = $empFieldsArray[$e]['fields'];

                //dump($valuesArray);

                $fieldsArray = array();

                for ($f = 0; $f < sizeof($fields); $f++) {

                    $fieldName = $fields[$f]['field_name'];
                    $fieldId = $fields[$f]['field_id'];

                    $valuesLookup = $this->searchArray($valuesArray, 'field_id', $fieldId);
                    $fieldValue = $valuesLookup[0]['field_value'];

                    $fieldsArray[$fieldName] = array(
                        $fieldValue
                    );

                }

                array_push($formFieldsSubArray,$fieldsArray);

                $fieldsArray = array();

            }

            if($thisEmp != $nextEmp) {
                $formFieldsArray[$employee] = $formFieldsSubArray;
                $formFieldsSubArray = array();
            }

        }

        return $formFieldsArray;

    }

    public function searchArray($array, $key, $value){

        $return = array();
        foreach ($array as $k=>$subarray){
            if (isset($subarray[$key]) && $subarray[$key] == $value) {
                $return[0] = $subarray;
                return $return;
            }
        }
    }

}