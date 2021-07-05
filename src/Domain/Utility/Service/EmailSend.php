<?php

namespace App\Domain\Utility\Service;

use Slim\Views\Twig;
use Postmark\PostmarkClient;
use Postmark\Models\PostmarkException;
use Postmark\Models\PostmarkAttachment;
use Postmark\PostmarkAdminClient;
use App\Domain\Requests\Repository\RequestFetchRepository;
use App\Domain\Customers\Repository\CustomerSitesAllFetchRepository;
use App\Domain\Utility\Service\CommonFunctions;

final class EmailSend
{
    private $twig;
    private $req;
    private $sites;
    private $common;

    public function __construct(
            Twig $twig, 
            RequestFetchRepository $req, 
            CustomerSitesAllFetchRepository $sites,
            CommonFunctions $common
        )
    {
        $this->twig = $twig;
        $this->req = $req;
        $this->sites = $sites;
        $this->common = $common;
    }

    public function sendEmail($data)
    {

        //dump($data);

        $reqId = $data['quote_email_req'];
        $emailTo = $data['quote_email_to'];
        $emailCc = $data['quote_email_cc'];
        //$emailContent = $data['confirm_email_content'];

        $request = $this->req->getRequest($reqId);

        $empsQuoted = $request['ws_pdf_chf'];
        $empsQuotedArray = json_decode($empsQuoted, true);

        $empsDlArray = array();
        
        //dump($empsQuotedArray);

        for ($a=0; $a < sizeof($empsQuotedArray); $a++) {
            $empId = $empsQuotedArray[$a][0];
            $empsDlArray[] = $empId;
        }

        //dump($empsDlArray);

        $sitesLookup = $this->sites->getAllCustomerSites();

        $thisSiteCode = $request['ws_site_dept'];
        $siteDetails = $this->common->searchArray($sitesLookup, 'site_code', $thisSiteCode);
        $siteDesc = $siteDetails[0]['site_desc'];
        $siteShortDesc = $siteDetails[0]['site_short_desc'];

        $reqRef = $request['ws_ref'];

        $quoteRef = "RR".$reqRef."-".$siteShortDesc;

        //dump($request);
        
        //BUILD/ADD RIO ATTACHMENTS
        $rioPdfs = $request['ws_quote_pdfs'];
        $rioPdfsArray = json_decode($rioPdfs, true);
        $attachmentArray = array();

        for ($d=0; $d < sizeof($rioPdfsArray); $d++) {
            
            $rioPdf = $rioPdfsArray[$d];

            ${"attachmentFile".$d} = __DIR__.'/../../../../public/pdfs/completed/'.$rioPdf;
            $attachment = PostmarkAttachment::fromFile
            
            (${"attachmentFile".$d}, $rioPdf, 'application/pdf', 'application/pdf');
            
            array_push($attachmentArray, $attachment);
        }
        
        //BUILD/ADD QUOTE ATTACHMENT
        $quotePdf = __DIR__.'/../../../../public/pdfs/quotes/quote_'.$reqId.'.pdf';

        //dump($quotePdf);

        $quoteName = "quote_".$quoteRef.".pdf";

        $quoteAttachment = PostmarkAttachment::fromFile
            ($quotePdf, $quoteName, 'application/pdf', 'application/pdf');

        array_push($attachmentArray, $quoteAttachment);

        //BUILD/ADD QUOTE DRIVERS LICENCE
        for ($l=0; $l < sizeof($empsDlArray); $l++) {
            
            $empId = $empsDlArray[$l];
            $paddedEmpId = str_pad($empId, 6, "0", STR_PAD_LEFT);

            $dl = "dl_".$paddedEmpId.".png";

            ${"attachmentFile".$d} = __DIR__.'/../../../../public/drivers_licences/'.$dl;
            $attachment = PostmarkAttachment::fromFile
            
            (${"attachmentFile".$d}, $dl, 'image/png', 'image/png');
            
            array_push($attachmentArray, $attachment);
        }

        $emailAddressee = $request['ws_cust_contact'];
        $rrMobiliser = $request['ws_mobiliser'];
        
        $fetchArray = array(

            'email_addressee' => $emailAddressee,
            'rr_mobiliser' => $rrMobiliser
        );
        
        $htmlBody = $this->twig->fetch('layout/email/email.quote.twig', $fetchArray);

        $exceptionMsg = '';

        try {
            $client = new PostmarkClient("97d8e7c1-e30c-43d6-8d35-2e1593e2e506");
            $sendResult = $client->sendEmail(
                "allan.hyde@tektools.com.au", //FROM
                $emailTo, //TO
                "READY RESOURCES MOBILISATION QUOTATION - ".$quoteRef,
                $htmlBody,
                NULL,
                NULL,
                false,
                NULL,
                $emailCc, ///CC
                NULL,
                NULL,
                $attachmentArray,
                NULL
            );

        } catch (PostmarkException $ex) {
            // If client is able to communicate with the API in a timely fashion,
            // but the message data is invalid, or there's a server error,
            // a PostmarkException can be thrown.
            $exceptionMsg .= $ex->httpStatusCode;
            $exceptionMsg .= $ex->message;
            $exceptionMsg .= $ex->postmarkApiErrorCode;

        } catch (Exception $generalException) {
            // A general exception is thrown if the API
            // was unreachable or times out.
        }

        //dump($exceptionMsg);

        if(empty($exceptionMsg)){
            $sendResult = 'OK';
        } else {
            $sendResult = $exceptionMsg;
        }

        //dump($sendResult);

        return $sendResult;

    }
}