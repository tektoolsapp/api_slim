<?php

namespace App\Domain\Messages\Repository;
use App\Domain\User\Repository\UsersListRepository;
use App\Domain\Utility\Service\CommonFunctions;
use PDO;

class MessagesFetchRepository
{
    private $users;
    private $common;
    private $connection;


    public function __construct(
        CommonFunctions $common,
        UsersListRepository $users,
        PDO $connection
    )
    {
        $this->users = $users;
        $this->common = $common;
        $this->connection = $connection;
    }

    public function getMessages($messageTo)
    {

        $users = $this->users->getUsers();
        
        $messageCount = 0;
        
        $sql = "SELECT * FROM messages WHERE 
            message_to = :message_to AND 
            message_type = 'U' AND 
            message_status <> 'X'
        ";
        $statement = $this->connection->prepare($sql);
        $statement->execute(['message_to' => $messageTo]);

        $messages = $statement->fetchAll(PDO::FETCH_ASSOC);

        //LOOP THROUGH MESSAGES AND FORMAt SENT DATE
        for ($m=0; $m < sizeof($messages); $m++) {
             
            $thisMessageTo = $messages[$m]['message_from'];
            
            $usersLookup = $this->common->searchArray($users, 'id', $thisMessageTo);
            $userFirstName = $usersLookup[0]['first_name'];
            $userLastName = $usersLookup[0]['last_name'];
            $messages[$m]['message_from'] = $userFirstName . " ".$userLastName;
           
            $thisMessageSent = $messages[$m]['message_sent'];
            $thisFormattedDate = date('d-m-Y h:i A',$thisMessageSent);
            $messages[$m]['message_sent'] = $thisFormattedDate;

            $thisMessageStatus = $messages[$m]['message_status'];
            if($thisMessageStatus == 'P'){
                $messageCount++;
            }

        }    

        $_SESSION['num_messages'] = $messageCount;

        $returnArray = array(
            "status" => 201,
            "data" => $messages,
            "num_messages" => $messageCount
        );

        return $returnArray;
    }
}