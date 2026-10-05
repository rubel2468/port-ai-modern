const fs = require('fs');
const path = require('path');

const filesToFix = [
  'app/api/bookings/route.ts',
  'app/api/bookings/[id]/cancel/route.ts',
  'app/api/payment/init/route.ts',
  'app/api/vendor/bookings/route.ts',
  'app/api/vendor/dashboard/route.ts',
  'app/api/vendor/hotels/[id]/route.ts', // might exist
  'app/api/vendor/offers/route.ts', // might exist
  'app/api/vendor/promotions/route.ts', // might exist
];

function fixFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  if (content.includes('import { authOptions }')) {
    return; // Already fixed
  }

  // Replace await getServerSession() with await getServerSession(authOptions)
  if (content.includes('await getServerSession()')) {
    content = content.replace(/await getServerSession\(\)/g, 'await getServerSession(authOptions)');
    
    // Add import { authOptions } from "@/lib/auth";
    const importMatch = content.match(/import \{.*getServerSession.*\} from "next-auth";/);
    if (importMatch) {
      content = content.replace(importMatch[0], `${importMatch[0]}\nimport { authOptions } from "@/lib/auth";`);
    } else {
      content = 'import { authOptions } from "@/lib/auth";\n' + content;
    }
    
    fs.writeFileSync(fullPath, content);
    console.log('Fixed', filePath);
  }
}

// Check other files in app/api
function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
       // get relative path
       const relative = path.relative(__dirname, fullPath).replace(/\\/g, '/');
       if (relative !== 'app/api/vendor/hotels/route.ts' && relative !== 'app/api/auth/[...nextauth]/route.ts') {
         fixFile(relative);
       }
    }
  }
}

walk(path.join(__dirname, 'app/api'));

console.log('Done');
