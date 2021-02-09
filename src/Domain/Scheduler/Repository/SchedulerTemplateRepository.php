<?php

namespace App\Domain\Scheduler\Repository;

use DomainException;
use PDO;

class SchedulerTemplateRepository
{
    private $connection;

    public function __construct(
            PDO $connection 
        )
    {
        $this->connection = $connection;
    }

    public function bookingsFromTemplate(array $template)
    {
        //BUILD TEMPLATES ARRAY FROM FORM DATA
        $templatesArray = array();

        foreach ($template as $key=>$value){
            
            $temps = explode('-', $key);
            $tempkey = $temps[0];
            $tempId = array_pop($temps);

            if($tempkey == 'swing_reference'){
                $refArray = explode('-', $value);
                $siteShort = $refArray[1];
                $templatesArray[$tempId-1][$tempkey] = $value; 
                $templatesArray[$tempId-1]['site_dept'] = $siteShort; 
            } else {
                $templatesArray[$tempId-1][$tempkey] = $value; 
            }
        }
        
        dump($templatesArray);

        for ($t = 0; $t < sizeof($templatesArray); $t++) {

            $request = $templatesArray[$t]['swing_request'];

            dump($request);

            //BUILD THE BOOKINGS HERE






        }
            
        return $template;
    }
}