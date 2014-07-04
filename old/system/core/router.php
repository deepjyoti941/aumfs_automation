<?php
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim(array('templates.path' => $_SERVER['DOCUMENT_ROOT'] . "/views"));
//$app->response->headers->set('Content-Type', 'application/json');

$app->get('/', function () use ($app) {
	$app->render('login.php');
//$app->renderIndex();
//$req = $app->request();
//$title = $req->params('title');
});

$app->get('/dashboard', function () use ($app) {
$app->render('index.php');
});

$app->get('/login', function () use ($app) {
$app->render('login.php');
});

$app->get('/logout', function () use ($app) {
$app->renderIndex();
});

$app->get('/register', function () use ($app) {
$app->renderIndex();
});

$app->get('/lock-screen', function () use ($app) {
$app->renderIndex();
});

$app->group('/categories', function () use ($app) {
$app->get('/', function () use ($app) {
$app->renderIndex();
});
$app->get('/:id', function () use ($app) {
$app->renderIndex();
});
});

$app->group('/shops', function () use ($app) {
$app->get('/', function () use ($app) {
$app->renderIndex();
});
$app->get('/:id', function () use ($app) {
$app->renderIndex();
});
});

$app->group('/coupons', function () use ($app) {
$app->get('/', function () use ($app) {
$app->renderIndex();
});
$app->get('/:id', function ($id) use ($app) {
$app->renderIndex();
});
});

$app->post('/saveImage', function () use ($app) {
$body = json_decode($app->request()->getBody());
$params = (array) $body;
$name = $params['id'] . '_' . $params['index'] . '.jpg';
$url = 'temp/' . $name;

// remove the base64 part
$base64 = preg_replace('#^data:image/[^;]+;base64,#', '', $params['image']);
$base64 = base64_decode($base64);

$source = imagecreatefromstring($base64); // create
imagejpeg($source, $url, 100); // save image

// return URL
$validation = array (
'url'     => $url,
'thumb'   => $url . '?' . sha1(uniqid(mt_rand(), true)),
'name'    => $name
);
echo json_encode($validation);
});

$app->get('/dashboard', function () use ($app) {
$app->renderIndex();
});

$app->get('/dashboard', function () use ($app) {
$app->renderIndex();
});

$app->run();