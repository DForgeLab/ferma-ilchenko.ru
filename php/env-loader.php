<?php
/**
 * Простой загрузчик переменных окружения из файла env.txt
 * Использование: include_once 'env-loader.php';
 */

function loadEnv($path = '../env.txt') {
    if (!file_exists($path)) {
        error_log("Файл окружения не найден: $path");
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Пропускаем комментарии
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Разбираем строку KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // Устанавливаем переменную окружения
            putenv("$key=$value");
            // Также устанавливаем как $_ENV для удобства
            $_ENV[$key] = $value;
        }
    }

    return true;
}

// Автоматическая загрузка при включении файла
loadEnv();
?>
