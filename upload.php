<?php
// print_r($_FILES);

$dir = './uploads';
$file = $_FILES['file'];
print_r($file['tmp_name']);
$destination = $dir.'/'.time().'-'.$file['name'];

move_uploaded_file($file['tmp_name'], $destination);

header('content-type: application/json');
echo json_encode([
    'status' => true,
    'message' => "Berhasil diupload."
]); 
