import 'dotenv/config';
import { WOLFBot } from 'wolf.js';

// إعدادات التحكم المستعادة (نظام الـ 20 ساعة)
const CONFIG = {
    identity: process.env.U_MAIL,
    access: process.env.U_PASS,
    gate_in: parseInt(process.env.ENTRY_P),
    gate_out: parseInt(process.env.EXIT_P),
    trigger_signal: process.env.MATCH_V,
    command_exec: process.env.EXEC_V
};

const engine = new WOLFBot();

// عند جاهزية النظام
engine.on.ready(() => {
    console.log(`[${new Date().toLocaleTimeString()}] System Online: Monitoring Signals...`);
});

// مراقبة الرسائل الخاصة وتنفيذ الأمر فوراً
engine.on.privateMessage(async (data) => {
    try {
        // التحقق من مصدر الرسالة ومحتواها (إشارة الطاقة)
        if (data.authorId === CONFIG.gate_in && data.content.includes(CONFIG.trigger_signal)) {
            
            console.log("🎯 Watch Found! Deploying action...");

            // إرسال أمر الجلد إلى الروم المستهدفة
            await engine.messaging().sendGroupMessage(CONFIG.gate_out, CONFIG.command_exec);
            
            console.log("🚀 Success: Command sent successfully.");
        }
    } catch (error) {
        // إدارة الأخطاء بصمت لضمان استمرار البوت
    }
});

// تسجيل الدخول
engine.login(CONFIG.identity, CONFIG.access);
