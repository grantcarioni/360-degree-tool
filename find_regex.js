const fs = require('fs');
const content = fs.readFileSync('c:/Users/gcarioni/OneDrive - Nutrition International/Desktop/AI Projects/NI 360° Feedback Platform/assets/index-D70MpLBd.js', 'utf8');

const patterns = [
  'hr@nutritionintl.org',
  'manager@nutritionintl.org',
  'employee@nutritionintl.org',
  'admin@nutritionintl.org'
];

patterns.forEach(p => {
  let index = content.indexOf(p);
  if (index !== -1) {
    console.log(`\n--- Context for ${p} ---`);
    console.log(content.substring(index - 150, index + 150));
  }
});

// Search for anything that looks like a password next to an email
const credMatches = content.match(/\{[^}]*@nutritionintl\.org[^}]*\}/g);
console.log('\n--- Full User Objects ---');
if (credMatches) {
  credMatches.forEach(m => console.log(m));
} else {
  console.log('None');
}


