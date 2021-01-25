<?php

namespace App\Action;

use App\Util\FilenameFilter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class FilePondRevertAction
{
    private $tempDirectory = __DIR__ . '/../../tmp/upload';

    /**
     * Revert upload.
     *
     * @see https://pqina.nl/filepond/docs/patterns/api/server/#revert
     *
     * @param ServerRequestInterface $request The request
     * @param ResponseInterface $response The response
     *
     * @return ResponseInterface The response
     */
    public function __invoke(
        ServerRequestInterface $request,
        ResponseInterface $response
    ): ResponseInterface {

        $remFile = $request->getBody();

        dump($remFile);

        // The server uses the unique id to remove the file
        $filename = FilenameFilter::createSafeFilename((string)$request->getBody());

        if (!$filename) {
            return $response;
        }

        $fullPath = sprintf('%s/%s', $this->tempDirectory, $filename);

        if (file_exists($fullPath)) {
            unlink($fullPath);
        }

        return $response;
    }
}
