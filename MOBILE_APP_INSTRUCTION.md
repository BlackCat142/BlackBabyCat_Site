# Инструкция по сборке мобильных приложений

## ✅ Что уже сделано:
- Установлен Capacitor.js - фреймворк для создания нативных приложений
- Созданы проекты для Android и iOS
- Настроена структура проекта

## 📁 Структура проекта:
```
/workspace/
├── www/              # Исходные файлы сайта (будут в приложении)
├── android/          # Android проект (открыть в Android Studio)
├── ios/              # iOS проект (открыть в Xcode)
├── capacitor.config.json  # Конфигурация Capacitor
└── package.json      # Зависимости npm
```

## 🚀 Как собрать приложение:

### Для Android:

**Вариант 1: Android Studio (рекомендуется)**
1. Откройте Android Studio
2. Выберите `File` → `Open` → выберите папку `/workspace/android`
3. Дождитесь синхронизации Gradle
4. Нажмите `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
5. APK файл будет создан в `android/app/build/outputs/apk/`

**Вариант 2: Командная строка**
```bash
cd /workspace/android
./gradlew assembleDebug
```
APK файл: `android/app/build/outputs/apk/debug/app-debug.apk`

Для release версии (нужен signing key):
```bash
./gradlew assembleRelease
```

### Для iOS:

**Требуется macOS с Xcode**

1. Откройте Xcode
2. Выберите `File` → `Open` → выберите папку `/workspace/ios/App/App.xcworkspace`
3. Выберите устройство или симулятор
4. Нажмите `Product` → `Build` (Cmd+B)
5. Для запуска на устройстве нужна учетная запись Apple Developer

## 📱 Обновление приложения после изменений:

Если вы изменили файлы в `/workspace/www/`:
```bash
cd /workspace
npx cap sync
```

Это скопирует изменения в проекты Android и iOS.

## 🔧 Настройки перед публикацией:

### Android (android/app/src/main/AndroidManifest.xml):
- Измените package name если нужно
- Настройте разрешения (permissions)
- Добавьте иконки разных размеров

### iOS (ios/App/App/Info.plist):
- Измените Bundle Identifier
- Настройте Info.plist параметры
- Добавьте иконки в Assets.xcassets

## 📤 Публикация:

### Google Play Store:
1. Создайте аккаунт разработчика ($25 единоразово)
2. Подготовьте релизную версию с подписью
3. Загрузите APK/AAB через Google Play Console

### Apple App Store:
1. Нужен аккаунт Apple Developer ($99/год)
2. Требуется macOS с Xcode
3. Настройте сертификаты и профили provisioning
4. Соберите архив и загрузите через App Store Connect

## 🛠 Полезные команды:

```bash
# Синхронизировать изменения
npx cap sync

# Открыть в Android Studio
npx cap open android

# Открыть в Xcode
npx cap open ios

# Запустить на подключенном устройстве
npx cap run android
npx cap run ios
```

## ⚠️ Важные замечания:

1. **iOS разработка**: Требуется компьютер Mac с установленным Xcode
2. **Подписи**: Для публикации нужны сертификаты разработчика
3. **Тестирование**: Перед публикацией обязательно протестируйте на реальных устройствах
4. **Иконки**: Добавьте все необходимые размеры иконок для магазинов приложений

## 📞 Дополнительные ресурсы:
- [Документация Capacitor](https://capacitorjs.com/docs)
- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)
