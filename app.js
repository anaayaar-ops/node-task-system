import wolfjs from 'wolf.js';
// ملاحظة: إذا كان البوت يستخدم require، استبدل السطر أعلاه بـ:
// const { WOLF } = require('wolf.js');

const { WOLF } = wolfjs;
const service = new WOLF();

async function start() {
    console.log("🛠️ تحويل البوت لمهمة: رفع الفعالية...");

    try {
        // نستخدم نفس بيانات الدخول الخاصة بالسباق
        const loginResponse = await service.login("mona2468@gmail.com", "As1412as", 8);

        if (loginResponse.success) {
            console.log("✅ البوت متصل. جاري تنفيذ الرفع...");

            const response = await service.websocket.emit('group event create', {
                id: 66266,
                title: "فعالية بوتات",
                description: "تم الرفع بنجاح عبر سكريبت المهمة الواحدة",
                startsAt: new Date(2026, 1, 22, 15, 45, 0).toISOString(),
                endsAt: new Date(2026, 1, 22, 16, 30, 0).toISOString(),
                columnId: 10
            });

            if (response.success) {
                console.log("🎯 مبروك! تم رفع الفعالية بنجاح. ID:", response.body.id);
            } else {
                console.log("❌ فشل الرفع. السبب:", response.headers?.reason);
            }
        } else {
            console.log("❌ فشل الدخول. تأكد من إغلاق أي نسخة أخرى من البوت.");
        }
    } catch (err) {
        console.error("⚠️ خطأ:", err.message);
    }

    console.log("⌛ تمت المهمة. يمكنك الآن استعادة كود السباق القديم.");
    process.exit(); 
}

start();
