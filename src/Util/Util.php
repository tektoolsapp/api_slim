<?php

namespace App\Util;

use Valitron\Validator;
use App\Exceptions\ValidationException;
use Psr\Http\Message\ServerRequestInterface;

class Util
{
    public function validate(ServerRequestInterface $request, array $rules = [])
    {
        $validator = new Validator(
            $params = $request->getParsedBody()
        );

        $validator->mapFieldsRules($rules);

        if (!$validator->validate()) {
            throw new ValidationException(
                $validator->errors(),
                $request->getUri()->getPath()
            );
        }

        return $params;
    }
}
