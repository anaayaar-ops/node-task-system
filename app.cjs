require('dotenv').config();
const wolf = require('wolf.js');

const client = new wolf.WOLF({
    device: wolf.DeviceType.ANDROID
});

client.on('ready', async () => {
    // قمنا بإزالة السطر الذي يحاول الوصول لـ nickname لتجنب الخطأ
    console.log('تم تسجيل الدخول بنجاح!');

    try {
        await client.presence.update(wolf.OnlineState.BUSY);
        console.log('تم ضبط الحالة بنجاح إلى: مشغول (Busy)');
    } catch (err) {
        console.error('فشل تحديث الحالة:', err);
    }
});

client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
