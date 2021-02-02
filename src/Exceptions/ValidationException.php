<?php

namespace App\Exceptions;

use Exception;

class ValidationException extends Exception
{
    protected $errors;

    protected $path;

    public function __construct(array $errors, $path)
    {
        $this->errors = $errors;
        $this->path = $path;
    }

    public function getErrors()
    {
        return $this->errors;
    }

    public function getPath()
    {
        return $this->path;
    }
}