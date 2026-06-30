require('dotenv').config();
const wolf = require('wolf.js');

const client = new wolf.WOLF({
    device: wolf.DeviceType.ANDROID
});

client.on('ready', async () => {
    console.log('تم تسجيل الدخول بنجاح!');

    try {
        // بدلاً من client.presence.update، جرب استخدام الدالة مباشرة:
        await client.presence(wolf.OnlineState.BUSY);
        console.log('تم ضبط الحالة بنجاح إلى: مشغول (Busy)');
    } catch (err) {
        console.error('فشل تحديث الحالة:', err);
    }
});

client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
