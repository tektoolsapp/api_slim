<?php

namespace App\Domain\Utility\Service;

use App\Domain\Requests\Repository\RequestFetchQuotesRepository;
use App\Domain\Requests\Repository\RequestUpdateQuotesRepository;

class PdfSave
{

    private $chfArray;
    private $requestQuotes;

    public function __construct(
        RequestFetchQuotesRepository $requestQuotes,
        RequestUpdateQuotesRepository $chfArray
    )
    {
        $this->requestQuotes = $requestQuotes;
        $this->chfArray = $chfArray;
    }

    public function savePdf($pdfContent)
    {
        $req = $pdfContent['req'];
        $paddedReq = str_pad($req, 6, "0", STR_PAD_LEFT);
        $type = strtolower($pdfContent['type']);
        $emp = $pdfContent['emp'];

        $target_dir = 'pdfs/completed/'; // add the specific path to save the file
        $extension = 'pdf';
        //$file = uniqid() .'.'. $extension; // rename file as a unique name

        $rand = mt_rand(100000, 999999);

        $file = $paddedReq."_".$type."_".$emp."_".$rand;
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