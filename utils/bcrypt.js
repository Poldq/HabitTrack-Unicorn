const bcrypt = require('bcrypt')
const saltRounds = 10;

async function hashPassword(plaintextPassword) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plaintextPassword, salt);
    return hash;
  } catch (error) {
    throw new Error('Error hashing password');
  }
}


async function comparePasswords(plaintextPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}


module.exports = {
  hashPassword,
  comparePasswords,
}