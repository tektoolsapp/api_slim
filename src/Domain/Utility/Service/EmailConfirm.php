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

final class EmailConfirm
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

    public function sendConfirmationEmail($data)
    {

        dump($data);

        $request = $data['confirm_email_req'];
        $emailTo = $data['confirm_email_to'];
        $emailCc = $data['confirm_email_cc'];
        $emailContent = $data['confirm_email_content'];

        $request = $this->req->getRequest($request);
        
        $sitesLookup = $this->sites->getAllCustomerSites();

        $thisSiteCode = $request['ws_site_dept'];
        $siteDetails = $this->common->searchArray($sitesLookup, 'site_code', $thisSiteCode);
        $siteDesc = $siteDetails[0]['site_desc'];
        $siteShortDesc = $siteDetails[0]['site_short_desc'];

        $reqRef = $request['ws_ref'];

        $quoteRef = "RR".$reqRef."-".$siteShortDesc;

        //dump($request);
        
        $emailAddressee = $request['ws_cust_contact'];
        $rrMobiliser = $request['ws_mobiliser'];
        
        $fetchArray = array(

            'email_addressee' => $emailAddressee,
            'rr_mobiliser' => $rrMobiliser,
            'email_content' => $emailContent
        );
        
        $htmlBody = $this->twig->fetch('layout/email/email.confirm.twig', $fetchArray);

        $exceptionMsg = '';

        /**
         * Send an email.
         *
         * @param  string $from The sender of the email. (Your account must have an associated Sender Signature for the address used.)
         * @param  string $to  The recipient of the email.
         * @param  string $subject  The subject of the email.
         * @param  string $htmlBody  The HTML content of the message, optional if Text Body is specified.
         * @param  string $textBody  The text content of the message, optional if HTML Body is specified.
         * @param  string $tag  A tag associated with this message, useful for classifying sent messages.
         * @param  boolean $trackOpens  True if you want Postmark to track opens of HTML emails.
         * @param  string $replyTo  Reply to email address.
         * @param  string $cc  Carbon Copy recipients, comma-separated
         * @param  string $bcc  Blind Carbon Copy recipients, comma-separated.
         * @param  array $headers  Headers to be included with the sent email message.
         * @param  array $attachments  An array of PostmarkAttachment objects.
         * @param  string $trackLinks  Can be any of "None", "HtmlAndText", "HtmlOnly", "TextOnly" to enable link tracking.
         * @param  array $metadata  Add metadata to the message. The metadata is an associative array, and values will be evaluated as strings by Postmark.
         * @param  array $messageStream  The message stream used to send this message. If not provided, the default transactional stream "outbound" will be used.
         * @return DynamicResponseModel
         */
        
        try {
            $client = new PostmarkClient("97d8e7c1-e30c-43d6-8d35-2e1593e2e506");
            $sendResult = $client->sendEmail(
                "allan.hyde@tektools.com.au", //FROM
                $emailTo, //TO
                "READY RESOURCES REQUEST CONFIRMATION - ".$quoteRef,
                $htmlBody,
                NULL,
                NULL,
                false,
                NULL,
                $emailCc, ///CC
                NULL,
                NULL,
                NULL,//$attachmentArray,
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

        dump($exceptionMsg);

        //dump($sendResult);

        return $sendResult;

    }
}