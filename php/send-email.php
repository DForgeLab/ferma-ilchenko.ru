<?php
header("Content-Type: application/json");

// Получаем данные
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'error',
        'message' => 'Нет данных или неверный формат JSON'
    ]);
    exit;
}

// === Системные данные ===
$sourceUrl = $_SERVER['HTTP_REFERER'] ?? 'Неизвестный источник';
$userIp = $_SERVER['REMOTE_ADDR'];
$userAgent = $_SERVER['HTTP_USER_AGENT'];
$date = date('d.m.Y H:i:s');

$finalUTM = [];
if (isset($data['get']) && is_array($data['get'])) {
    $finalUTM = $data['get'];
    unset($data['get']); // Удаляем 'get' из основных данных
}

// === Добавляем системные поля ===
$systemData = [
    'source_url' => $sourceUrl,
    'user_ip' => $userIp,
    'user_agent' => $userAgent,
    'timestamp' => $date
];

// === Настройки Email ===
$to = "webmasterd088@gmail.com"; // Email получателя - замените на нужный адрес
$subject = "Новая заявка с сайта Молочные Фермы Ильченко";

// === Формируем HTML письмо ===
$message = "
<!DOCTYPE html>
<html lang='ru'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Новая заявка</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2E7D32, #4CAF50); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { padding: 20px 0; }
        .field { margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px; border-left: 4px solid #2E7D32; }
        .field strong { color: #2E7D32; display: block; margin-bottom: 5px; }
        .system-info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-top: 20px; font-size: 12px; }
        .utm-info { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #4CAF50; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>📩 Новая заявка с сайта</h2>
            <p><strong>Время создания:</strong> {$date}</p>
        </div>

        <div class='content'>
            <h3>📋 Данные заявки:</h3>";

foreach ($data as $key => $value) {
    if (!empty($value) && !in_array($key, ['source_url', 'user_ip', 'user_agent', 'timestamp', 'utm'])) {
        // Если это телефон — очищаем от всего, кроме + и цифр
        if ($key === 'phone' || $key === 'tel') {
            $value = preg_replace('/[^\d+]/', '', $value);
        }

        $fieldName = ucfirst($key);
        $message .= "<div class='field'><strong>{$fieldName}:</strong> " . htmlspecialchars($value) . "</div>";
    }
}

// UTM-метки (только если есть)
if (!empty($finalUTM)) {
    $message .= "<div class='utm-info'><h4>🔍 UTM-метки:</h4>";
    foreach ($finalUTM as $key => $value) {
        $message .= "<div><strong>" . ucfirst($key) . ":</strong> " . htmlspecialchars($value) . "</div>";
    }
    $message .= "</div>";
}

// Системные данные
$message .= "
            <div class='system-info'>
                <h4>⚙️ Системные данные:</h4>
                <pre>";
foreach ($systemData as $key => $value) {
    if (!empty($value)) {
        $message .= ucfirst($key) . ": " . htmlspecialchars($value) . "\n";
    }
}
$message .= "</pre>
            </div>
        </div>
    </div>
</body>
</html>";

// === Настройки заголовков ===
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: Молочные Фермы Ильченко <noreply@ilchenko-farm.ru>" . "\r\n";
$headers .= "Reply-To: info@ilchenko-farm.ru" . "\r\n";

// === Отправка Email ===
$mailSent = mail($to, $subject, $message, $headers);

if (!$mailSent) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error',
        'message' => 'Ошибка при отправке email'
    ]);
    exit;
}

// === Успешный ответ клиенту ===
http_response_code(200);
echo json_encode([
    'status' => 'success',
    'message' => 'Заявка успешно отправлена',
    'timestamp' => $date
]);