require('dotenv').config();
const wolf = require('wolf.js');

// نحاول ضبط الجهاز مباشرة بالقيمة الرقمية 7 (وهي تمثل Android)
const client = new wolf.WOLF({
    device: 7 
});

client.on('ready', async () => {
    console.log('تم الاتصال بنجاح!');
    
    try {
        await client.setOnlineState(wolf.OnlineState.BUSY);
        console.log('تم ضبط الحالة إلى مشغول (Busy)');
    } catch (err) {
        console.error('فشل تحديث الحالة:', err);
    }
});

client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
