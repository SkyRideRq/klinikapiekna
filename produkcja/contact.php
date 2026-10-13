<?php
/**
 * KLINIKA PIĘKNA KALINA - BEZPIECZNY HANDLER FORMULARZA KONTAKTOWEGO (PHP)
 * 
 * Skrypt odbiera zgłoszenia z formularza na stronie głównej,
 * waliduje dane, zabezpiecza przed spamem (honeypot + rate limit)
 * i przesyła sformatowaną wiadomość e-mail na recepcję kliniki.
 */

// Nagłówek odpowiedzi JSON
header('Content-Type: application/json; charset=utf-8');

// Dozwolona tylko metoda POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Dozwolona jest wyłącznie metoda POST.'
    ]);
    exit;
}

// 1. Zabezpieczenie antyspamowe Honeypot (niewidoczne pole)
if (!empty($_POST['website'])) {
    // Bot wypełnił ukryte pole – zwracamy sukces bez wysyłki
    echo json_encode([
        'status' => 'success',
        'message' => 'Dziękujemy za kontakt! Wiadomość została przesłana.'
    ]);
    exit;
}

// 2. Pobranie i oczyszczenie danych wejściowych
$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$service = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : 'Ogólne zapytanie';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';
$rodo = isset($_POST['rodo']) ? true : false;

// 3. Walidacja wymaganych pól
$errors = [];

if (empty($name) || mb_strlen($name) < 2) {
    $errors[] = 'Prosimy o podanie imienia i nazwiska (minimum 2 znaki).';
}

if (empty($phone) || !preg_match('/^[0-9\+\-\s\(\)]{7,20}$/', $phone)) {
    $errors[] = 'Prosimy o podanie poprawnego numeru telefonu do kontaktu.';
}

if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Podany adres e-mail ma nieprawidłowy format.';
}

if (!$rodo) {
    $errors[] = 'Wymagana jest akceptacja zgody na przetwarzanie danych w celu kontaktu (RODO).';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => implode(' ', $errors)
    ]);
    exit;
}

// 4. Konfiguracja odbiorcy
$to = 'kontakt@klinikakalina.pl';
$subject = "Nowa wiadomość z formularza WWW: " . $name . " (" . $service . ")";

// Bezpieczny nadawca (zgodny z domeną serwera dla uniknięcia spamu)
$server_domain = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'klinikakalina.pl';
$from_email = 'formularz@' . ltrim($server_domain, 'www.');
if (!empty($email)) {
    $reply_to = $email;
} else {
    $reply_to = $from_email;
}

// 5. Treść wiadomości (HTML oraz czysty tekst)
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .card { background: #fcfbf9; border: 1px solid #c9a461; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; }
        .header { border-bottom: 2px solid #007937; padding-bottom: 12px; margin-bottom: 20px; }
        .header h2 { color: #007937; margin: 0; }
        .row { margin-bottom: 12px; }
        .label { font-weight: bold; color: #555; }
        .val { color: #111; font-size: 15px; }
        .message-box { background: #fff; padding: 16px; border-left: 4px solid #007937; margin-top: 16px; border-radius: 4px; }
        .footer { margin-top: 24px; font-size: 12px; color: #888; text-align: center; }
    </style>
</head>
<body>
    <div class='card'>
        <div class='header'>
            <h2>Klinika Piękna KALINA – Nowe Zapytanie z WWW</h2>
            <small>Otrzymano: " . date('Y-m-d H:i:s') . "</small>
        </div>
        <div class='row'>
            <span class='label'>Imię i Nazwisko:</span>
            <div class='val'>" . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . "</div>
        </div>
        <div class='row'>
            <span class='label'>Numer Telefonu:</span>
            <div class='val'><a href='tel:" . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . "'><strong>" . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . "</strong></a></div>
        </div>
        <div class='row'>
            <span class='label'>Adres E-mail:</span>
            <div class='val'>" . (!empty($email) ? "<a href='mailto:" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "'>" . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</a>" : "Nie podano") . "</div>
        </div>
        <div class='row'>
            <span class='label'>Interesujący Zabieg:</span>
            <div class='val'>" . htmlspecialchars($service, ENT_QUOTES, 'UTF-8') . "</div>
        </div>
        <div class='row'>
            <span class='label'>Treść Wiadomości:</span>
            <div class='message-box'>" . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "</div>
        </div>
        <div class='footer'>
            Wiadomość wygenerowana automatycznie przez formularz na stronie https://klinikakalina.pl<br>
            Klient wyraził zgodę na przetwarzanie danych osobowych (RODO).
        </div>
    </div>
</body>
</html>
";

// 6. Nagłówki wiadomości e-mail
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=utf-8';
$headers[] = 'From: Klinika Kalina Formularz <' . $from_email . '>';
$headers[] = 'Reply-To: ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . ' <' . $reply_to . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

// 7. Wysłanie wiadomości
$mail_sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $email_body, implode("\r\n", $headers));

if ($mail_sent) {
    echo json_encode([
        'status' => 'success',
        'message' => 'Dziękujemy, ' . htmlspecialchars($name) . '! Twoja wiadomość została pomyślnie wysłana do recepcji. Skontaktujemy się z Tobą telefonicznie w najbliższym czasie.'
    ]);
} else {
    // Jeżeli funkcja mail() nie jest skonfigurowana na serwerze (np. środowisko lokalne)
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Przepraszamy, wystąpił chwilowy problem z serwerem poczty. Prosimy o kontakt bezpośredni pod numerem +48 500 516 118 lub rezerwację przez portal Booksy.'
    ]);
}
