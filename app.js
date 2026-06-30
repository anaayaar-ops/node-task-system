// استيراد المتغيرات البيئية (الطريقة الصحيحة في ESM)
import 'dotenv/config'; 

// استيراد مكتبة wolf.js
import wolf from 'wolf.js';

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

// استخدام المتغيرات المحددة U_MAIL و U_PASS
// ملاحظة: في ES Modules، نستخدم process.env للوصول للمتغيرات
client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
