require('dotenv').config();
const wolf = require('wolf.js');

// 1. تعريف العميل (هذا السطر هو المسؤول عن إنشاء المتغير client)
const client = new wolf.WOLF({
    device: wolf.DeviceType.ANDROID
});

// 2. حدث الجاهزية (الآن يتعرف البرنامج على client لأنه تم تعريفه بالأعلى)
client.on('ready', async () => {
    console.log('تم الاتصال بنجاح!');
    
    try {
        await client.setOnlineState(wolf.OnlineState.BUSY);
        console.log('تم ضبط الحالة بنجاح إلى: مشغول (Busy)');
    } catch (err) {
        console.error('فشل تحديث الحالة:', err);
    }
});

// 3. تسجيل الدخول
client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
