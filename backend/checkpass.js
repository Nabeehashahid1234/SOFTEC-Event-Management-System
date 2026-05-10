const bcrypt = require('bcryptjs');

async function check() {
  const result = await bcrypt.compare('qwerty', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8o6wLYuGkU2m0rQzS9Wy2R3sjJq3Rq');
  console.log('qwerty:', result);
}

check();