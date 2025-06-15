<?php
header("Content-Type: application/json");

// Получаем данные
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'Нет данных']);
    exit;
}

// Проверка обязательных полей (например, телефон или email)
if (empty($data['phone'])) {
    echo json_encode(['status' => 'error', 'message' => 'Нет телефона']);
    exit;
}

// === Настройки Telegram ===
$botToken = "ВАШ_ТОКЕН_БОТА"; // ← ЗАМЕНИТЬ
$chatId   = "@ваш_канал_или_id_чата"; // например "-123456789" или "@username"

// === Формируем текст сообщения ===
$message = "📩 Новая заявка с сайта:\n\n";

foreach ($data as $key => $value) {
    if (!empty($value)) {
        $message .= "<b>" . ucfirst($key) . ":</b> " . htmlspecialchars($value) . "\n";
    }
}

// === Отправка в Telegram ===
$url = "https://api.telegram.org/bot{$botToken}/sendMessage";

$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
$response = curl_exec($ch);
curl_close($ch);

// === Ответ клиенту ===
echo json_encode([
    'status' => 'success'
]);