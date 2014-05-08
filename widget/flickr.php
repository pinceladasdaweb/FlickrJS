<?php
header('Content-type: application/json');

function get_curl($url) {
    if(function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $output = curl_exec($ch);
        echo curl_error($ch);
        curl_close($ch);
        return $output;
    } else{
        return file_get_contents($url);
    }
}

function jsonp_decode($jsonp, $assoc = false) {
    if($jsonp[0] !== '[' && $jsonp[0] !== '{') {
       $jsonp = substr($jsonp, strpos($jsonp, '('));
    }
    return json_decode(trim($jsonp,'();'), $assoc);
}

$apiKey = '';
$user   = isset($_GET['user']) ? $_GET['user'] : NULL;
$count  = isset($_GET['count']) ? $_GET['count'] : 10;

$getId  = get_curl('https://api.flickr.com/services/rest/?api_key='.urlencode($apiKey).'&format=json&method=flickr.urls.lookupUser&url=http://www.flickr.com/photos/'.urlencode($user).'/');
$data   = jsonp_decode($getId, true);
$id     = $data['user']['id'];

$getImages = get_curl('https://api.flickr.com/services/rest/?api_key='.urlencode($apiKey).'&format=json&method=flickr.people.getPublicPhotos&user_id='.urlencode($id).'&per_page='.urlencode($count));
$service   = jsonp_decode($getImages, true);


echo json_encode($service);