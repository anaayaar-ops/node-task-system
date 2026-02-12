import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateA: 80277459,              // معرف البوت الذي يرسل رسالة الطاقة
    gateB: parseInt(process.env.EXIT_P), // رقم الروم (القناة)
    trigger: process.env.MATCH_V,         // "Your animal is back to full energy!"
    action: process.env.EXEC_V,           // "!س جلد خاص 80055399"
    myId: "80055399"                      // رقم عضويتك للتأكد من رسالة السباق
};

const service = new WOLF();

// دالة إرسال الأمر للروم
const sendToGroup = async () => {
    try {
        await service.messaging().sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم إرسال أمر الجلد إلى الروم [${settings.gateB}]`);
    } catch (err) {
        console.log("❌ فشل الإرسال للروم:", err.message);
    }
};

service.on('ready', () => {
    console.log(`✅ البوت متصل بنجاح.`);
    console.log(`📡 يراقب الطاقة من: [${settings.gateA}]`);
    console.log(`📡 يراقب السباق لـ: [${settings.myId}] في الروم [${settings.gateB}]`);
});

// 1. مراقبة رسائل الخاص (لرسالة الطاقة)
service.on('privateMessage', async (message) => {
    const senderId = message.authorId || message.sourceSubscriberId;
    const text = message.content || "";

    if (senderId === settings.gateA && text.includes(settings.trigger)) {
        console.log("⚡ تم استلام رسالة الطاقة من البوت! جاري التنفيذ...");
        await sendToGroup();
    }
});

// 2. مراقبة رسائل الروم (لإعادة المحاولة إذا كان السباق جارياً)
service.on('groupMessage', async (message) => {
    const text = message.content || "";
    if (!text) return;

    // التأكد أن الرسالة في الروم الصحيح + تحتوي على جملة السباق + تحتوي على رقم عضويتك
    if (message.targetGroupId === settings.gateB && 
        text.includes("ما زال السباق جاريًا") && 
        text.includes(settings.myId)) {
        
        // استخراج الثواني من الرسالة
        const match = text.match(/\d+/);
        const waitSeconds = match ? parseInt(match[0]) : 25;
        
        console.log(`⚠️ السباق لا يزال جارياً لـ [${settings.myId}]. سأنتظر ${waitSeconds} ثانية...`);

        setTimeout(async () => {
            console.log(`🔄 انتهى الانتظار. إعادة المحاولة الآن...`);
            await sendToGroup();
        }, (waitSeconds + 1) * 1000);
    }
});

service.login(settings.identity, settings.secret);
