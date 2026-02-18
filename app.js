import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateB: parseInt(process.env.EXIT_P),  
    action: "الان",                       
};

const service = new WOLF();

// دالة تنفيذ الإرسال المصححة
const executeAction = async () => {
    try {
        // التعديل هنا: الوصول للملحق مباشرة دون أقواس ()
        await service.messaging.sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم إرسال [${settings.action}] بنجاح`);
    } catch (err) {
        console.error("❌ فشل الإرسال:", err.message);
    }
};

service.on('ready', () => {
    console.log(`✅ البوت جاهز ويعمل بحساب: ${service.currentSubscriber.nickname}`);
});

service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    if (message.targetGroupId === settings.gateB && text.includes("اكتب {الان} بعد مرور")) {
        
        const match = text.match(/\d+/);
        const secondsToWait = match ? parseInt(match[0]) : 11;

        console.log(`🎯 رصدت العبارة! الانتظار لمدة ${secondsToWait} ثانية...`);

        setTimeout(async () => {
            console.log("⏱️ انتهى الوقت! جاري الإرسال...");
            await executeAction();
        }, secondsToWait * 1000);
    }
});

service.login(settings.identity, settings.secret);
