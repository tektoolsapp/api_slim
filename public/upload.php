<?php

$name = "myest.pdf";

move_uploaded_file(
    $_FILES['pdf']['tmp_name'],
    $_SERVER['DOCUMENT_ROOT'] . "/uploads/$name"
);