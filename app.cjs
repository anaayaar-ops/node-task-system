// استخدام require بدلاً من import
require('dotenv').config(); 
const wolf = require('wolf.js');

const client = new wolf.Client();

client.on('ready', async () => {
    console.log(`تم تسجيل الدخول بنجاح كـ: ${client.user.nickname}`);
    
    try {
        await client.presence.update(wolf.Presence.Busy);
        console.log('تم ضبط الحالة إلى: مشغول (Busy)');
    } catch (err) {
        console.error('فشل تحديث الحالة:', err);
    }
});

// تسجيل الدخول باستخدام المتغيرات
client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
