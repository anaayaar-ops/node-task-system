require('dotenv').config();
const wolf = require('wolf.js');

// 1. إعدادات البوت
const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateA: parseInt(process.env.ENTRY_P), // معرف البوت مصدر الطاقة
    gateB: parseInt(process.env.EXIT_P),  // رقم الروم
    trigger: process.env.MATCH_V,         
    action: process.env.EXEC_V,
    myId: "80055399"                      // معرفك الخاص للمطابقة
};

// 3. دالة تنفيذ الإرسال (تم تحديثها لتتوافق مع client)
const executeAction = async () => {
    try {
        console.log("🎯 محاولة تنفيذ الإرسال...");
        await client.messaging.sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم الإرسال بنجاح إلى [${settings.gateB}]`);
    } catch (err) {
        console.error("❌ فشل الإرسال:", err.message);
    }
};

// 4. حدث الاتصال (Ready) - هنا نقوم بضبط الحالة وإرسال أمر التدريب
client.on('ready', async () => {
    console.log("------------------------------------------");
    console.log(`✅ تم تسجيل الدخول: ${client.currentSubscriber.nickname}`);
    console.log("------------------------------------------");

    try {
        // ضبط الحالة إلى مشغول
        await client.setOnlineState(wolf.OnlineState.BUSY);
        console.log('تم ضبط الحالة بنجاح إلى: مشغول (Busy)');

        // إرسال أمر التدريب
        await client.messaging.sendPrivateMessage(settings.gateA, "!س تدريب كل 1");
        console.log("✉️ تم إرسال أمر التدريب التلقائي بنجاح.");
    } catch (err) {
        console.error("❌ حدث خطأ أثناء التجهيز:", err.message);
    }
});

// 5. الاستجابة لرسالة الطاقة (الخاص)
client.on('privateMessage', async (message) => {
    const senderId = message.authorId || message.sourceSubscriberId;
    const text = message.content || message.body || "";

    if (senderId === settings.gateA && text.includes(settings.trigger)) {
        console.log("⚡ رصد رسالة طاقة! جاري الجلد...");
        await executeAction();
    }
});

// 6. الاستجابة لرسالة "السباق جاري" (الروم)
client.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    if (message.targetGroupId === settings.gateB && 
        text.includes("ما زال السباق جاريًا") && 
        text.includes(settings.myId)) {
        
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 25;
        
        console.log(`⚠️ السباق جارٍ لـ [${settings.myId}]. انتظار ${waitSeconds} ثانية...`);

        setTimeout(async () => {
            console.log("🔄 انتهى الوقت. إعادة محاولة الجلد الآن...");
            await executeAction();
        }, (waitSeconds + 1) * 1000);
    }
});

// 7. تسجيل الدخول
client.login(settings.identity, settings.secret)
    .catch(err => console.error('خطأ في تسجيل الدخول:', err));
