<?php

namespace App\Action;

use App\Domain\Utility\Repository\UploadedFileRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\UploadedFileInterface;
//use Slim\Psr7\UploadedFile;

final class UploadFilesAction
{
    private $storageDirectory = __DIR__ . '/../../public/images';
    private $repository;

    public function __construct(UploadedFileRepository $repository)
    {
        $this->repository = $repository;
    }
    
    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {
        
        $storageDirectory = __DIR__ . '/../../public/images';
        $uploadedFiles = $request->getUploadedFiles();

        //dump($uploadedFiles);

        // handle single input with single file upload
        $uploadedFile = $uploadedFiles['filename'];

        dump($uploadedFile);
        
        if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
            $filename = $this->moveUploadedFile($storageDirectory, $uploadedFile);
            $response->getBody()->write('Uploaded: ' . $filename . '<br/>');
        
            //SAVE THE FILE

            $insertUploaed = $this->repository->insertUploadedFile($filename);
            //dump($insertUploaed);
        
        }

        return $response->withStatus(422);
    }

    function moveUploadedFile(string $storageDirectory, UploadedFileInterface $uploadedFile)
    {
        $extension = pathinfo($uploadedFile->getClientFilename(), PATHINFO_EXTENSION);

        // see http://php.net/manual/en/function.random-bytes.php
        $basename = bin2hex(random_bytes(8));
        $filename = sprintf('%s.%0.8s', $basename, $extension);

        $uploadedFile->moveTo($storageDirectory . DIRECTORY_SEPARATOR . $filename);

        return $filename;
    }

}