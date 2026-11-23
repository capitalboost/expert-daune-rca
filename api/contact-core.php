<?php
declare(strict_types=1);
function contact_response(array $data, callable $deliver): array {
    $name = trim(is_string($data['name'] ?? null) ? $data['name'] : '');
    $phone = trim(is_string($data['phone'] ?? null) ? $data['phone'] : '');
    $subject = is_string($data['subject'] ?? null) ? $data['subject'] : '';
    $subjects = ['constatare-rca'=>'Constatări daune RCA','masina-la-schimb'=>'Mașină la schimb','tractare'=>'Tractare auto','casco'=>'Dosar CASCO','dosar-existent'=>'Dosarul meu existent','alt-subiect'=>'Alt subiect'];
    if (!empty($data['website'])) return [422, ['ok'=>false,'message'=>'Solicitarea nu a putut fi validată.']];
    $digits = preg_replace('/\D/', '', $phone);
    if (!preg_match('/^.{2,100}$/us', $name) || preg_match('/[\x00-\x1F\x7F]/', $name) || !preg_match('/^[+0-9() .-]{7,25}$/D', $phone) || strlen($digits)<7 || strlen($digits)>15 || !isset($subjects[$subject]) || ($data['terms'] ?? null)!==true) {
        return [422, ['ok'=>false,'message'=>'Verifică numele, telefonul, subiectul și acceptarea termenilor.']];
    }
    $body = "Solicitare de contact — Expert Daune RCA\n\nNume: $name\nTelefon: $phone\nSubiect: {$subjects[$subject]}\nTermeni acceptați: da\n";
    if (!$deliver($body)) return [503, ['ok'=>false,'message'=>'Nu am putut trimite solicitarea. Încearcă din nou sau sună-ne la 0728 608 688.']];
    return [200, ['ok'=>true]];
}
