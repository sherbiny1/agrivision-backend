require('dotenv').config();
const fs = require('fs');
const path = require('path');

const checkDir = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            checkDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            try {
                require('./' + fullPath);
                console.log(`OK: ${fullPath}`);
            } catch (error) {
                console.error(`ERROR in ${fullPath}:`, error.message);
                process.exit(1);
            }
        }
    }
};

try {
    checkDir('src');
    console.log('All files required successfully. No syntax errors or missing modules found.');
} catch (err) {
    console.error('Fatal error:', err);
}
