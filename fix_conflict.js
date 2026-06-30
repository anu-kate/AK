const fs = require('fs');
const filePath = 'e:\\CODING\\anturun-v2\\apps\\customer\\src\\components\\tabs\\CartTab.vue';
let content = fs.readFileSync(filePath, 'utf-8');

const conflictRegex = /<<<<<<< Updated upstream:.*?\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> Stashed changes:.*?(?:\r?\n|$)/g;

content = content.replace(conflictRegex, '$2');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Fixed conflicts keeping stashed changes!');
