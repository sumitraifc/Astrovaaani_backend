const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const repo = require('./repository');

exports.login = async (email, password) => {
  const admin = await repo.findByEmail(email);
  if (!admin) throw new Error('Invalid email or password');

  const match = await bcrypt.compare(password, admin.password);
  if (!match) throw new Error('Invalid email or password');

  await repo.updateLastLogin(admin.id);

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
  };
};

exports.changePassword = async (adminId, oldPassword, newPassword) => {
  const [rows] = await require('../../../config/db').query(
    'SELECT password FROM admin_users WHERE id = ?', [adminId]
  );
  const admin = rows[0];
  if (!admin) throw new Error('Admin not found');

  const match = await bcrypt.compare(oldPassword, admin.password);
  if (!match) throw new Error('Current password is incorrect');

  const hashed = await bcrypt.hash(newPassword, 10);
  await repo.updatePassword(adminId, hashed);
  return true;
};
