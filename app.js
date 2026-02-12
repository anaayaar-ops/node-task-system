import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateA: parseInt(process.env.ENTRY_P), // معرف البوت مصدر الطاقة (الخاص)
    gateB: parseInt(process.env.EXIT_P),  // رقم الروم (الجلد)
    trigger: process.env.MATCH_V,         // نص اكتمال الطاقة
    action: process.env.EXEC_V,           // أمر الجلد الأساسي
    myId: "80055399"                      // معرف الحساب
};

const service = new WOLF();

// دالة الانتظار
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// الدالة الأساسية للدورة (جلد -> انتظار -> جلد -> تدريب)
const runFullCycle = async () => {
    try {
        // 1. الجلد الأول في الروم
        console.log("⚔️ تنفيذ الجلد الأول في الروم...");
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        
        // 2. الانتظار 43 ثانية
        console.log("⏳ انتظار 43 ثانية للجلد الثاني...");
        await delay(43000);
        
        // 3. الجلد الثاني في الروم
        console.log("⚔️ تنفيذ الجلد الثاني في الروم...");
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        
        // 4. الذهاب للخاص للتدريب
        await delay(43000); // فاصل بسيط
        console.log("🏋️ الذهاب للخاص لتنفيذ أمر التدريب...");
        await service.messaging().sendPrivateMessage(settings.gateA, "!س تدريب كل 60");
        
        console.log("✅ انتهت الدورة. في انتظار اكتمال الطاقة مرة أخرى...");
    } catch (err) {
        console.error("❌ حدث خطأ أثناء الدورة:", err.message);
    }
};

service.on('ready', () => {
    console.log("------------------------------------------");
    console.log("✅ البوت متصل ومستعد لمراقبة الطاقة...");
    console.log(`🎯 الحساب: ${settings.myId} | الروم: ${settings.gateB}`);
    console.log("------------------------------------------");
});

// مراقبة الرسائل الخاصة (رصد اكتمال الطاقة)
service.on('privateMessage', async (message) => {
    const senderId = message.authorId || message.sourceSubscriberId;
    const text = message.content || message.body || "";

    // إذا وصلت رسالة اكتمال الطاقة من البوت المصدر
    if (senderId === settings.gateA && text.includes(settings.trigger)) {
        console.log("⚡ الطاقة اكتملت! بدء الدورة التلقائية...");
        await runFullCycle();
    }
});

// مراقبة رسالة "السباق جاري" لإعادة المحاولة (اختياري لضمان الجلد)
service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";
    if (message.targetGroupId === settings.gateB && 
        text.includes("ما زال السباق جاريًا") && 
        text.includes(settings.myId)) {
        
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 20;
        
        console.log(`⚠️ الروم مشغول. إعادة المحاولة بعد ${waitSeconds} ثانية...`);
        setTimeout(async () => {
            await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        }, (waitSeconds + 1) * 1000);
    }
});

service.login(settings.identity, settings.secret);
