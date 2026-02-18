import 'dotenv/config';
import wolfjs from 'wolf.js';

const { WOLF } = wolfjs;

const settings = {
    identity: process.env.U_MAIL,
    secret: process.env.U_PASS,
    gateB: parseInt(process.env.EXIT_P),
    action: "الان",
    // 💡 في السيرفر، ابدأ بـ offset صغير مثل 100 وجرب
    // لأن السيرفر قريب من سيرفرات ولف، التأخير أقل
    offset: 115
};

const service = new WOLF();

// إرسال فوري بدون أي تأخير في المعالجة
const fire = () => {
    service.messaging.sendGroupMessage(settings.gateB, settings.action)
        .catch(() => {}); // تجاهل الأخطاء لسرعة التنفيذ
};

service.on('ready', () => {
    console.log(`🚀 السيرفر جاهز | التوقيت المستهدف: -${settings.offset}ms`);
});

service.on('groupMessage', async (message) => {
    const text = message.content || message.body || "";

    if (message.targetGroupId === settings.gateB && text.includes("اكتب {الان} بعد مرور")) {
        
        const match = text.match(/\d+/);
        const seconds = match ? parseInt(match[0]) : 11;
        
        // التوقيت المستهدف بالملي ثانية
        const targetMs = (seconds * 1000) - settings.offset;
        const startTime = Date.now();

        console.log(`🎯 هدف: ${seconds} ثانية | الانتظار: ${targetMs}ms`);

        // المرحلة 1: انتظار هادئ (للحفاظ على موارد السيرفر)
        setTimeout(() => {
            
            // المرحلة 2: الانتظار النشط (Busy-Wait) لأعلى دقة ممكنة
            // هنا المعالج يراقب الوقت في كل ميكرو ثانية في آخر 10ms
            while (Date.now() - startTime < targetMs) {
                // حلقة مفرغة سريعة جداً لمنع الـ Event Loop من النوم
            }
            
            // المرحلة 3: الإطلاق!
            fire();
            console.log("🔥 تم الإطلاق في الجزء من الثانية المطلوب!");

        }, targetMs - 10); // نبدأ الهجوم قبل الوقت بـ 10 ملي ثانية
    }
});

service.login(settings.identity, settings.secret);
