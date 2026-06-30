require('dotenv').config();
const wolf = require('wolf.js');

const client = new wolf.WOLF({
    device: wolf.DeviceType.ANDROID
});

client.on('ready', () => {
    console.log('تم الاتصال! جاري البحث عن دالة الحالة...');
    
    // طباعة كل خصائص الكائن client
    // هذا سيكشف لنا الدوال المتاحة
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(client));
    console.log('الدوال المتاحة في client هي:', methods);
    
    // سأنتظر منك نسخ هذه القائمة في الرد القادم
});

client.login(process.env.U_MAIL, process.env.U_PASS)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
