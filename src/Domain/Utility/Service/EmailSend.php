<?php

namespace App\Domain\Utility\Service;

use Slim\Views\Twig;
use Postmark\PostmarkClient;
use Postmark\Models\PostmarkException;
use Postmark\Models\PostmarkAttachment;
use Postmark\PostmarkAdminClient;

final class EmailSend
{
    private $twig;

    public function __construct(Twig $twig)
    {
        $this->twig = $twig;
    }

    public function sendEmail()
    {

        $htmlBody = $this->twig->fetch('layout/email/email.test.twig');

        $attachmentFile = __DIR__.'/../../../../public/pdfs/completed/000001_chf.pdf';

        dump($attachmentFile);

        $attachment = PostmarkAttachment::fromFile
        ($attachmentFile, 'attachment.pdf', 'application/pdf', 'application/pdf');

        $exceptionMsg = '';

        /*
        sendEmail(
            $from,
            $to,
            $subject,
            $htmlBody = NULL,
            $textBody = NULL,
            $tag = NULL,
            $trackOpens = true,
            $replyTo = NULL,
            $cc = NULL,
            $bcc = NULL,
            $headers = NULL,
            $attachments = NULL,
            $trackLinks = NULL
        )
        */

        try {
            $client = new PostmarkClient("97d8e7c1-e30c-43d6-8d35-2e1593e2e506");
            $sendResult = $client->sendEmail(
                "allan.hyde@tektools.com.au",
                "allan.hyde@livepages.com.au",
                "Hello from Postmark!",
                $htmlBody,
                NULL,
                NULL,
                false,
                NULL,
                NULL,
                NULL,
                NULL,
                [$attachment],
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

        //dump($sendResult);

        return $sendResult;

    }
}