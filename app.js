import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    groupId: parseInt(process.env.EXIT_P), 
    targetTrigger: process.env.MATCH_V, 
    actionResponse: process.env.EXEC_V  
};

const service = new WOLF();

service.on('ready', async () => {
    console.log("------------------------------------------");
    console.log(`✅ البوت متصل الآن`);

    try {
        // 1. تصحيح الحالة: مسح النص القديم "2" وجعل النقطة حمراء
        await service.websocket.emit('subscriber profile update', {
            status: "",          // مسح رقم 2 من نص الحالة
            onlineState: 2       // جعل الأيقونة حمراء (Busy)
        });
        console.log("🔴 تم تحديث الحالة للون الأحمر");
    } catch (err) {
        console.log("⚠️ فشل تحديث الحالة، لكن البوت سيعمل.");
    }
    
    console.log(`👀 يراقب الروم: ${settings.groupId}`);
    console.log(`🎯 يبحث عن نص: ${settings.targetTrigger}`);
    console.log("------------------------------------------");
});

// استخدام 'message' بدلاً من 'groupMessage' لضمان التقاط كافة أنواع الرسائل
service.on('message', async (message) => {
    // التأكد أنها رسالة مجموعة (Group)
    if (!message.isGroup) return;

    // الحصول على النص وتجريده من الفراغات
    const text = (message.content || message.body || "").trim();
    const targetGroupId = message.targetGroupId || message.recipientId;

    // طباعة كل رسالة تصل للروم في الكونسول للتأكد من القراءة (يمكنك حذف هذا السطر لاحقاً)
    if (targetGroupId === settings.groupId) {
        console.log(`📩 رسالة مستلمة: [${text}]`);
    }

    // التحقق من المطابقة
    if (targetGroupId === settings.groupId && text === settings.targetTrigger) {
        console.log(`🎯 تم رصد الهدف! جاري الرد...`);
        try {
            // محاولة الإرسال بأكثر من طريقة لضمان العمل
            const messaging = typeof service.messaging === 'function' ? service.messaging() : service.messaging;
            
            await messaging.sendGroupMessage(settings.groupId, settings.actionResponse);
            console.log(`🚀 تم الجلد بنجاح!`);
        } catch (err) {
            console.error("❌ فشل الإرسال:", err.message);
        }
    }
});

// التعامل مع أخطاء تسجيل الدخول أو الانقطاع
service.on('error', (err) => {
    console.error("⚠️ خطأ في الاتصال:", err.message);
});

service.login(settings.identity, settings.secret);
