import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateA: parseInt(process.env.ENTRY_P), 
    gateB: parseInt(process.env.EXIT_P),  
    trigger: process.env.MATCH_V,         
    action: process.env.EXEC_V,
    notifyMsg: process.env.NOTIFY_MSG || "✅ تم إعادة اللعب!",
    myId: "80055399" // 💡 ضع رقم عضويتك هنا
};

const service = new WOLF();

// دالة الإرسال
const sendCommand = async (isRetry = false) => {
    try {
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم تنفيذ: [${settings.action}]`);
        
        if (isRetry) {
            await service.messaging().sendPrivateMessage(settings.gateA, settings.notifyMsg);
        }
    } catch (err) {
        console.log("❌ فشل الإرسال:", err.message);
    }
};

service.on('ready', () => {
    console.log(`✅ البوت متصل ومستعد تماماً.`);
    console.log(`🎯 المعرف المراقب: [${settings.myId}]`);
});

service.on('groupMessage', async (message) => {
    const text = message.content || "";
    if (!text) return;

    // التحقق من النص: إذا احتوى على الجملة + رقم الـ ID الخاص بك
    if (message.targetGroupId === settings.gateB && 
        text.includes("ما زال السباق جاريًا") && 
        text.includes(settings.myId)) {
        
        // البحث عن رقم الثواني في الرسالة
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 25;
        
        console.log(`⚠️ كشف انشغال السباق لـ [${settings.myId}]. انتظار ${waitSeconds} ثانية...`);

        setTimeout(async () => {
            console.log(`🔄 انتهى الانتظار. إعادة المحاولة الآن...`);
            await sendCommand(true);
        }, (waitSeconds + 1) * 1000);
    }
});

service.on('privateMessage', async (message) => {
    const senderId = message.authorId || message.sourceSubscriberId;
    const text = message.content || "";
    
    // استقبال إشارة الطاقة من الحساب المصدر
    if (senderId === settings.gateA && text.includes(settings.trigger)) {
        console.log("🎯 رصد إشارة طاقة. جاري الهجوم...");
        await sendCommand(false);
    }
});

service.login(settings.identity, settings.secret);
