<?php

namespace App\Action;

use App\Domain\Utility\Repository\UploadedFileRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
//use Slim\Psr7\UploadedFile;
use Slim\Psr7\Factory\StreamFactory;

use Intervention\Image\ImageManager;

final class UploadFilesAction
{
    //private $storageDirectory = __DIR__ . '/../../public/images';
    private $repository;
    private $imageManager;

    public function __construct(UploadedFileRepository $repository, ImageManager $imageManager)
    {
        $this->repository = $repository;
        $this->imageManager = $imageManager;
    }
    
    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        
        $data = (array)$request->getParsedBody();
        var_dump("DATA");
        var_dump($data);

        var_dump("LICENCE");
        var_dump($data['type']);

        $userId = $data['user_id'];
        var_dump("USER");
        var_dump($userId);

        if($data['type'] == 'licence'){
            $storageDirectory = __DIR__ . '/../../public/drivers_licences';
            var_dump($storageDirectory);
        } else {
            $storageDirectory = __DIR__ . '/../../public/images';
        }    

        $uploadedFiles = $request->getUploadedFiles();

        //dump($uploadedFiles);

        $uploadedFile = $uploadedFiles['File'];
        var_dump("UPLOADED FILE");
        var_dump($uploadedFile);

        //$fileName = $storageDirectory.'/testing5.png';
        //$this->imageManager->make($uploadedFile)->save($fileName); 

        //dump("UPLOADED FILE:");
        //dump($uploadedFile->getMaxFilesize());

        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = $this->moveUploadedFile($storageDirectory, $uploadedFile, $userId);
            //INSERT THE UPLOADED FILE
            $insertUpload = $this->repository->insertUploadedFile($filename, $userId);
            var_dump($insertUpload);
            $response->getBody()->write('Uploaded: ' . $filename . '<br/>');
        }

        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(201);
    }

    function moveUploadedFile(string $storageDirectory, UploadedFileInterface $uploadedFile, $userId)
    {
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);

        // see http://php.net/manual/en/function.random-bytes.php
        $basename = bin2hex(random_bytes(8));

        $basename = 'dl_'.str_pad($userId, 6, "0", STR_PAD_LEFT);

        $filename = $basename.".".$extension;

        //$filename = sprintf('%s.%0.8s', $basename, $extension);

        $uploadedFile->moveTo($storageDirectory . DIRECTORY_SEPARATOR . $filename);

        return $filename;
    }

}