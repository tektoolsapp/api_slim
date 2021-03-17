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

        //dump("SENDING");
        
        $token = 'fM_sOUjDokv_gSN4M2DjQl:APA91bHvUnRMbJpJRGeQQbewQtb2HTRRse6Gz_IdwoQkMQXpQ6csDk-yX7Nvn6dmpnhhhyhW-EoAT3dQbBShvefHHgiYoUknGgdgWMDbteZ_g34KcNPCt5tYLxHbVVzdVcdlrpaWffe3';
        /* $data = array(
            "data" => array(
                "click_action" => "FLUTTER_NOTIFICATION_CLICK" 
            ),
            "notification" => array(
                "title" => "FCM Message",
                "body" => "This is an FCM Message from SLIM JJJ",
            )
         ); */

        /* $fields = array(
            'to' => $token,
            'data' => $data
        ); */

        $fields = array(
            "notification" => array(
                "body" => "This is an FCM Message from SLIM MMMMM",
                "title" => "FCM Message BBBBB",
                //"click_action" => "FLUTTER_NOTIFICATION_CLICK" 
            ),
            //"priority" => 'high',
            //"data" => array(
              //  "click_action" => "FLUTTER_NOTIFICATION_CLICK" 
            //),
            'to' => $token
        );

        //$fields = json_encode($fields);

        //dump($fields);

        $headers = array (
            'Content-Type: application/json',
            'Authorization: key=AAAAYvL6Qlo:APA91bFpdngfedK164jvGmhxD9a0oU3yGADshblqNIWkd_OB0VqsYo7-Kf32H5jmG7Td8rEx4ZwfLoY1sULR2GUcclfBEsBM07YBUP1qa1Uonm6s6e3d78HROtSPf_I2XI72Wvse8UMi'
        );

        //dump($headers);

        $ch = curl_init();
        curl_setopt( $ch,CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send' );
        curl_setopt( $ch,CURLOPT_POST, true );
        curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, true );
        curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode($fields) );
        curl_exec( $ch );
        $newresult = curl_exec($ch);

        //dump("NR: ");
        //dump($newresult);

        if ($newresult === FALSE) {
            //dump(curl_error($ch));    
            //die('FCM Send Error: ' . curl_error($ch));
        }
        curl_close( $ch );
        
        /* $returnData = array(
            'title'=> 'FCM TEST',
        ); */

        //

        /*
        $target = 'fM_sOUjDokv_gSN4M2DjQl:APA91bHvUnRMbJpJRGeQQbewQtb2HTRRse6Gz_IdwoQkMQXpQ6csDk-yX7Nvn6dmpnhhhyhW-EoAT3dQbBShvefHHgiYoUknGgdgWMDbteZ_g34KcNPCt5tYLxHbVVzdVcdlrpaWffe3';
        
        $data = array(
            //"data" => array(
              "notification" => array(
                  "title" => "FCM Message",
                  "body" => "This is an FCM Message from SLIM GGGG",
                )
            //)
         );

        $fields = array(
            //'to' => $token,
            'data' => $data
        );

        $server_key = 'AAAAYvL6Qlo:APA91bFpdngfedK164jvGmhxD9a0oU3yGADshblqNIWkd_OB0VqsYo7-Kf32H5jmG7Td8rEx4ZwfLoY1sULR2GUcclfBEsBM07YBUP1qa1Uonm6s6e3d78HROtSPf_I2XI72Wvse8UMi';
        //FCM api URL
        $rsp = [];
        $url = 'https://fcm.googleapis.com/fcm/send';
        //api_key available in Firebase Console -> Project Settings -> CLOUD MESSAGING -> Server key
        
        $server_key = $serverKey;
        
        //$fields = array();
        
        //$fields['data'] = $data;
        
        if(is_array($target)){
            $fields['registration_ids'] = $target;
        }else{
            $fields['to'] = $target;
        }

        dump($fields);
        //header with content_type api key
        $headers = array(
            'Content-Type:application/json',
            'Authorization:key='.$server_key,
            'priority:high',
            'content_available:true'
        );

        dump($headers);
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        $result = curl_exec($ch);
        if ($result === FALSE) {
            dump(curl_error($ch));   
            //die('FCM Send Error: ' . curl_error($ch));
        }
        curl_close($ch);
        
        //print_r($result);
        //return $result;

        dump($result);

        */

        
        //$response->getBody()->write((string)json_encode($returnData));

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);    

    }
}
