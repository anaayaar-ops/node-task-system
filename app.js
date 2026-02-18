import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateB: parseInt(process.env.EXIT_P),
    action: "الان",
    // 💡 قم بتعديل هذا الرقم (بالملي ثانية) لضبط الدقة
    // بما أن تأخيرك هو 0.16 ثانية، سنخصم 170 ملي ثانية
    offset: 170
};

const service = new WOLF();

const executeAction = async () => {
    try {
        await service.messaging.sendGroupMessage(settings.gateB, settings.action);
        console.log(`🚀 تم الإرسال [${settings.action}]`);
    } catch (err) {
        console.error("❌ فشل الإرسال:", err.message);
    }
};

service.on('ready', () => {
    console.log(`✅ البوت جاهز: ${service.currentSubscriber.nickname}`);
});

service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    if (message.targetGroupId === settings.gateB && text.includes("اكتب {الان} بعد مرور")) {
        
        const match = text.match(/\d+/);
        const secondsToWait = match ? parseInt(match[0]) : 11;

        // حساب الوقت الصافي: (الثواني * 1000) - التأخير
        const finalWait = (secondsToWait * 1000) - settings.offset;

        console.log(`🎯 رصدت العبارة! سأنتظر ${finalWait}ms (تم خصم ${settings.offset}ms لتجاوز التأخير)`);

        setTimeout(async () => {
            await executeAction();
        }, finalWait);
    }
});

service.login(settings.identity, settings.secret);
