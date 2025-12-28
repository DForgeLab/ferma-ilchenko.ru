<?php
header("Content-Type: application/json");

// Загружаем переменные окружения
include_once 'env-loader.php';

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

// === Настройки Telegram ===
$botToken = getenv('TELEGRAM_BOT_TOKEN') ?: "7688961097:AAEiTlx4oKkUlczVLxobwACcWDbq-ZjFuk4"; // Токен из переменных окружения
$chatId   = getenv('TELEGRAM_CHAT_ID') ?: "-1002774919895"; // ID группы из переменных окружения
$topicId  = getenv('TELEGRAM_TOPIC_ID') ?: 2; // ID темы из переменных окружения

// === Формируем текст сообщения ===
$message = "📩 <b>Новая заявка с сайта</b>\n";
$message .= "<b>⏰ Время создания:</b> " . htmlspecialchars($date) . "\n\n";

// Основные данные (без системных и UTM)
foreach ($data as $key => $value) {
    if (!empty($value) && !in_array($key, ['source_url', 'user_ip', 'user_agent', 'timestamp', 'utm'])) {

        // Если это телефон — очищаем от всего, кроме + и цифр
        if ($key === 'phone' || $key === 'tel') {
            $value = preg_replace('/[^\d+]/', '', $value);
        }

        $message .= "<b>📌 " . ucfirst($key) . ":</b> " . htmlspecialchars($value) . "\n";
    }
}

// UTM-метки (только если есть)
if (!empty($finalUTM)) {
    $message .= "\n<b>UTM-метки</b>:\n";
    foreach ($finalUTM as $key => $value) {
        $message .= "🔹 <b>" . ucfirst($key) . ":</b> " . htmlspecialchars($value) . "\n";
    }
}

// Системные данные
$message .= "\n⚙️ <b>Системные данные</b>:\n";
$message .= "<pre>";
foreach ($systemData as $key => $value) {
    if (!empty($value)) {
        $message .= ucfirst($key) . ":" . htmlspecialchars($value) . "\n";
    }
}
$message .= "\n</pre>\n";


// === Отправка в Telegram с отключением превью ===
$url = "https://api.telegram.org/bot{$botToken}/sendMessage";

$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML',
    'message_thread_id' => $topicId,
    'disable_web_page_preview' => true // Отключаем предпросмотр ссылок
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_TIMEOUT, 10); // Таймаут

$response = curl_exec($ch);

// === Проверка ошибок cURL ===
if (curl_errno($ch)) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error',
        'message' => 'Ошибка при отправке в Telegram: ' . curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

curl_close($ch);

// === Проверка ответа от Telegram ===
$telegramResponse = json_decode($response, true);

if (!$telegramResponse || !$telegramResponse['ok']) {
    http_response_code(503); // Service Unavailable
    echo json_encode([
        'status' => 'error',
        'message' => 'Telegram API вернул ошибку',
        'details' => $telegramResponse
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