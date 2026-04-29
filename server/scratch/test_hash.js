const bcrypt = require('bcryptjs');
const hash = '$2a$10$H1DVEGWuZlR9wJJlY1mKeuSPUZr3XyxQJ5MOEj50N0..5KDhiEN9O';
const password = 'admin123';

async function test() {
  const match = await bcrypt.compare(password, hash);
  console.log('Match:', match);
  process.exit(0);
}

test();
