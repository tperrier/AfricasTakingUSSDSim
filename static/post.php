<?php
header('Content-Type: application/json');

$request_body = file_get_contents('php://input');
$data = json_decode($request_body,TRUE);
$url = $data['url'];

$payload = json_encode([
  'sessionId' => $data['sessionId'],
  'serviceCode' => $data['serviceCode'],
  'phoneNumber' => $data['phoneNumber'],
  'text' => $data['text']
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HTTPHEADER, 'Content-Type: application/json');

$response = curl_exec($ch);
curl_close($ch);

echo $response;
echo json_encode( [ 'action' => 'con' , 'text' => $payload['sessionId'] ]);

?>
