require('dotenv').config();
const wolf = require('wolf.js');

// 1. إنشاء العميل مع تحديد الجهاز كـ أندرويد (Android)
const client = new wolf.WOLF({
    device: wolf.DeviceType.ANDROID
});

client.on('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح كـ: ${client.user.nickname}`);
    console.log('جاري ضبط الحالة إلى: مشغول (Busy)');

    try {
        // 2. تغيير الحالة إلى مشغول باستخدام OnlineState
        await client.presence.update(wolf.OnlineState.BUSY);
        console.log('تم ضبط الحالة بنجاح إلى: مشغول (Busy)');
    } catch (err) {
        console.error('فشل تحديث الحالة:', err);
    }
});

// تسجيل الدخول
client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
