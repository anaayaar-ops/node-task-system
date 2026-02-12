import 'dotenv/config';
import WOLFBot from 'wolf.js'; // هذا هو الاستدعاء الصحيح الذي اشتغل معك سابقاً

const CONFIG = {
    identity: process.env.U_MAIL,
    access: process.env.U_PASS,
    gate_in: parseInt(process.env.ENTRY_P),
    gate_out: parseInt(process.env.EXIT_P),
    trigger_signal: process.env.MATCH_V,
    command_exec: process.env.EXEC_V
};

const engine = new WOLFBot();

engine.on.ready(() => {
    console.log(`[${new Date().toLocaleTimeString()}] ✅ System Online: Monitoring Signals...`);
});

engine.on.privateMessage(async (data) => {
    try {
        // فحص مصدر الرسالة ومحتواها (رسالة الطاقة)
        if (data.authorId === CONFIG.gate_in && data.content.includes(CONFIG.trigger_signal)) {
            console.log("🎯 Match Found! Deploying action...");
            
            // إرسال الأمر للروم المحددة
            await engine.messaging().sendGroupMessage(CONFIG.gate_out, CONFIG.command_exec);
            
            console.log("🚀 Success: Command sent successfully.");
        }
    } catch (error) {
        // إدارة الأخطاء بصمت لضمان عدم توقف النظام
    }
});

engine.login(CONFIG.identity, CONFIG.access);
