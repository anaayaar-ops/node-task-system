import * as wolf from 'wolf.js';

console.log("--- فحص محتويات المكتبة ---");
console.log(Object.keys(wolf)); // سيعرض لك أسماء الأوامر الرئيسية
console.log("---------------------------");

if (wolf.default) {
    console.log("--- فحص المحتوى الافتراضي (Default) ---");
    console.log(Object.keys(wolf.default));
    console.log("---------------------------------------");
}
