require('dotenv').config();
const wolf = require('wolf.js');

// إنشاء العميل
const client = new wolf.WOLF({
    device: wolf.DeviceType.ANDROID
});

// عند الاتصال بنجاح
client.on('ready', async () => {
    console.log('تم الاتصال بنجاح!');
    
    try {
        // استخدام الدالة التي اكتشفناها setOnlineState
        await client.setOnlineState(wolf.OnlineState.BUSY);
        console.log('تم ضبط الحالة بنجاح إلى: مشغول (Busy)');
    } catch (err) {
        console.error('فشل تحديث الحالة:', err);
    }
});

// تسجيل الدخول
client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
