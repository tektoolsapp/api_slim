<?php

namespace App\Domain\Utility\Service;

class PdfQuote
{
    public function quotePdf($pdfContent)
    {
        $req = $pdfContent['req'];
        $paddedReq = str_pad($req, 6, "0", STR_PAD_LEFT);

        $target_dir = 'pdfs/quotes/';
        $extension = 'pdf';
        $file = "quote_".$paddedReq;

        $file_dir = $target_dir . $file .'.'. $extension;
        //dump($file_dir);

        $myPdf = explode(",",$pdfContent['file']);

        $usePdf = $myPdf[1];

        $bin = base64_decode($usePdf);
        //dump($bin);

        try {
            file_put_contents($file_dir, $bin); // save
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