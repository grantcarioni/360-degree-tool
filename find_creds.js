const fs = require('fs');
const content = fs.readFileSync('c:/Users/gcarioni/OneDrive - Nutrition International/Desktop/AI Projects/NI 360° Feedback Platform/assets/index-D70MpLBd.js', 'utf8');

const target = 'email@example.com';
let index = content.indexOf(target);
if (index !== -1) {
  console.log('--- Context for email@example.com ---');
  console.log(content.substring(index - 200, index + 200));
} else {
  console.log('Target email not found in direct search.');
}

const nearby = content.match(/\{[^}]*email@example\.com[^}]*\}/g);
console.log('\n--- Full Objects containing the email ---');
console.log(nearby || 'None');

