require('dotenv').config();
const wolf = require('wolf.js');

// تجربة تغيير المفتاح من 'device' إلى 'deviceType'
const client = new wolf.WOLF({
    deviceType: 7 // تجربة مفتاح مختلف
});

client.on('ready', async () => {
    // طباعة الجهاز الحالي للتأكد من القيمة
    console.log('نوع الجهاز الحالي المسجل هو:', client.device);
    
    try {
        await client.setOnlineState(wolf.OnlineState.BUSY);
        console.log('تم ضبط الحالة بنجاح');
    } catch (err) {
        console.error('فشل:', err);
    }
});

client.login(process.env.U_MAIL, process.env.U_PASS);
