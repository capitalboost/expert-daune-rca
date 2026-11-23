<?php
declare(strict_types=1);
require __DIR__.'/contact-core.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function respond(int $status, array $body): never {http_response_code($status);echo json_encode($body, JSON_UNESCAPED_UNICODE);exit;}
$to = getenv('EDRCA_CONTACT_TO') ?: '';
$from = getenv('EDRCA_CONTACT_FROM') ?: '';
$origin = rtrim(getenv('EDRCA_SITE_ORIGIN') ?: 'https://expertdaunerca.ro', '/');
$ready = (bool)(filter_var($to, FILTER_VALIDATE_EMAIL) && filter_var($from, FILTER_VALIDATE_EMAIL) && !preg_match('/[\r\n]/', $to.$from) && function_exists('mail'));
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method==='GET') respond(200, ['ready'=>$ready]);
if ($method!=='POST') {header('Allow: GET, POST');respond(405,['ok'=>false]);}
if (($_SERVER['HTTP_ORIGIN'] ?? '')!==$origin) respond(403,['ok'=>false,'message'=>'Reîncarcă pagina și încearcă din nou.']);
if (!$ready) respond(503,['ok'=>false,'message'=>'Ne poți contacta la 0728 608 688.']);
if (strtolower(trim(explode(';',$_SERVER['CONTENT_TYPE'] ?? '')[0]))!=='application/json') respond(415,['ok'=>false]);
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0)>4096) respond(413,['ok'=>false]);
$raw=file_get_contents('php://input',false,null,0,4097);
if (strlen($raw)>4096) respond(413,['ok'=>false]);
try {$data=json_decode($raw,true,32,JSON_THROW_ON_ERROR);} catch (Throwable $e) {respond(400,['ok'=>false]);}
if (!is_array($data)) respond(400,['ok'=>false]);
// Per-IP, per-15-minute limiter. Only pseudonymous counters outside the web root.
$directory=sys_get_temp_dir().'/edrca-callback-rate';
if (!is_dir($directory) && !@mkdir($directory,0700,true) && !is_dir($directory)) respond(503,['ok'=>false,'message'=>'Încearcă din nou mai târziu.']);
foreach (glob($directory.'/*.json') ?: [] as $old) if (filemtime($old)<time()-900) @unlink($old);
$identifier=hash('sha256',($_SERVER['REMOTE_ADDR'] ?? 'unknown').$from.floor(time()/900));
$handle=@fopen($directory.'/'.$identifier.'.json','c+');
if (!$handle || !flock($handle,LOCK_EX)) respond(503,['ok'=>false,'message'=>'Încearcă din nou mai târziu.']);
$count=(int)stream_get_contents($handle);
if ($count>=5) {flock($handle,LOCK_UN);fclose($handle);header('Retry-After: 900');respond(429,['ok'=>false,'message'=>'Ai trimis mai multe solicitări. Încearcă din nou peste 15 minute sau sună-ne.']);}
rewind($handle);ftruncate($handle,0);fwrite($handle,(string)($count+1));flock($handle,LOCK_UN);fclose($handle);
[$status,$result]=contact_response($data,static function(string $body) use ($to,$from): bool {
    $headers=['From'=>'Expert Daune RCA <'.$from.'>','MIME-Version'=>'1.0','Content-Type'=>'text/plain; charset=UTF-8'];
    return @mail($to,'Solicitare de contact - Expert Daune RCA',$body,$headers);
});
respond($status,$result);
