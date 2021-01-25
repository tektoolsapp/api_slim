<?php

namespace App\Util;

final class FilenameFilter
{
    /**
     * Makes file name safe to use.
     *
     * @param string $file The name of the file [not full path]
     *
     * @return  string The sanitised string
     */
    public static function createSafeFilename(string $file): string
    {
        // Remove any trailing dots, as those aren't ever valid file names.
        $file = trim($file, '.');

        return trim(preg_replace(['#(\.){2,}#', '#[^A-Za-z0-9\.\_\- ]#', '#^\.#'], '', $file));
    }
}
