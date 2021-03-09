<?php

namespace App\Action;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Views\Twig;

final class FcmSendAction
{
    private $twig;

    public function __construct(Twig $twig)
    {
        $this->twig = $twig;
    }

    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        
        /* return $this->twig->render($response, 'layout/content/pdf.test.twig', array(
            'title'=> 'PDF TEST',
        )); */

        $token = 'dhQfJLtNekhyi2bJdq4HgG:APA91bEN1Fzo6J5M5Z3lqKt103_Wml7JOybEqfoXIDiDPZDjwTlmEiHTKT5Ym23I5sOf1-4pzxQzn5_20h5kOHfCqPiOkFi2S2ysiK5FLJkYFPXl9X53qvGK0fF_j2t2PRiUyWAHgSNi';

        $data = array(
            "data" => array(
              "notification" => array(
                  "title" => "FCM Message",
                  "body" => "This is an FCM Message from SLIM GGGG",
                )
            )
         );

        $fields = array(
            'to' => $token,
            'data' => $data
        );

        //dump($fields);

        $headers = array (
            'Authorization: key=AAAAhSOG5g8:APA91bHRTph2jogzuNEWV5LHp7Klk5yMTerfmftjwsQskcBNBxwGFsTN3UeuQbEDtZVhP4r2RA7p4s5tI9i00wJ46masxgiCbmmFt9XtVLjO5fWD2KT8Y0defa8g-0-AHcu3KV5P8UpN',
            'Content-Type: application/json'
        );

        $ch = curl_init();
        curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
        curl_setopt( $ch,CURLOPT_POST, true );
        curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, true );
        curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode($fields) );
        curl_exec( $ch );
        $newresult = curl_exec($ch);
        /* if ($newresult === FALSE) {
            dump(curl_error($ch));    
            //die('FCM Send Error: ' . curl_error($ch));
        }  */
        curl_close( $ch );
        
        //$returnData = array(
          //  'title'=> 'FCM TEST',
        //);

        $response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);    

    }
}
