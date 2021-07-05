<?php

namespace App\Domain\Utility\Service;

use App\Domain\Requests\Repository\RequestFetchQuotesRepository;
use App\Domain\Requests\Repository\RequestUpdateQuotesRepository;
use App\Domain\Employees\Repository\EmployeesRepository;
use App\Domain\Utility\Service\CommonFunctions;

class PdfSave
{

    private $chfArray;
    private $requestQuotes;
    private $employees;
    private $common;

    public function __construct(
        RequestFetchQuotesRepository $requestQuotes,
        RequestUpdateQuotesRepository $chfArray,
        EmployeesRepository $employees,
        CommonFunctions $common
    )
    {
        $this->requestQuotes = $requestQuotes;
        $this->chfArray = $chfArray;
        $this->employees = $employees;
        $this->common = $common;
    }

    public function savePdf($pdfContent)
    {
        $req = $pdfContent['req'];
        $paddedReq = str_pad($req, 6, "0", STR_PAD_LEFT);
        $type = strtolower($pdfContent['type']);
        $emp = $pdfContent['emp'];
        $dateOfFirstSwingDep = $pdfContent['first_dep'];
        $siteCode = $pdfContent['site_code'];

        //GET EMPLOYEE DETAILS
        $employees = $this->employees->getEmployees();
        $employeesLookup = $this->common->searchArray($employees, 'emp_id',$emp);
        $employeeFirstName = $employeesLookup[0]['first_name'];
        $employeeLastName = strtoupper($employeesLookup[0]['last_name']);
        $employeeRehire = $employeesLookup[0]['emp_rehire'];
        if($employeeRehire == 'Y') {
            $rehireTxt = 'Rehire';
        } else {
            $rehireTxt = 'NewHire';
        }

        $target_dir = 'pdfs/completed/'; // add the specific path to save the file
        $extension = 'pdf';
        //$file = uniqid() .'.'. $extension; // rename file as a unique name

        //BUILD REQ REF

        $reqRaw = ltrim($req, "0");
        $paddedFileReq = str_pad($reqRaw, 4, "0", STR_PAD_LEFT);
        $reqRef = "RR".$paddedFileReq;

        //$rand = mt_rand(100000, 999999);

        if($type == 'sef'){

            //$dateOfFirstSwingDep = '12-04-2021';
            //$siteCode = 'BR2';

            $file = $employeeLastName."_".$employeeFirstName."_".strtoupper($type)."_".$dateOfFirstSwingDep."_".$siteCode."_".$reqRef;
        
        } else {
            $file = $employeeLastName."_".$employeeFirstName."_".strtoupper($type)."_".$rehireTxt." ".$reqRef;
        }

        //FOR SEF

        //Person Name (SURNAME, First name)_SEF_Departure DATE OF First SWING_ SITE (B2, B4, WA, MAR etc…)

        //$file = $paddedReq."_".$type."_".$emp."_".$rand;
        $file_dir = $target_dir . $file .'.'. $extension;

        //ADD THE FILE TO THE REQUEST
        $filename = $file.".".$extension;
        $quotePdfs = $this->requestQuotes->getRequest($req);

        //dump($quotePdfs);

        $quotePdfsExisting = $quotePdfs['ws_quote_pdfs'];

        //dump($quotePdfsExisting);

        if(!empty($quotePdfsExisting)){
            $quotesPdfArray = json_decode($quotePdfsExisting, true);
        } else {
            $quotesPdfArray = array();
        }

        //dump($quotesPdfArray);

        if(!in_array($filename, $quotesPdfArray)){
            $quotesPdfArray[] = $filename;
        }

        //dump($quotesPdfArray);

        $chfUpdate = $this->chfArray->updateRequest($req, $quotesPdfArray);

        //$file_dir = $target_dir . $file .'.'. $extension;
        //dump($file_dir);

        $bin = base64_decode($pdfContent['file'], true);

        try {
            file_put_contents($file_dir, $bin); // save
            //header('Content-Type: application/json');
            return "File Uploaded Successfully";
        } catch (Exception $e) {
            header('Content-Type: application/json');
            return $e->getMessage();
        }

    }

    public static function isBase64Encoded($str)
    {
        try
        {
            $decoded = base64_decode($str, true);

            if ( base64_encode($decoded) === $str ) {
                return true;
            }
            else {
                return false;
            }
        }
        catch(Exception $e)
        {
            // If exception is caught, then it is not a base64 encoded string
            return false;
        }

    }

}