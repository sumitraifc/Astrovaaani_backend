const jwt = require('jsonwebtoken');
const repo = require('./repository');

exports.login = async (email, password) => {
  const admin = await repo.findByEmail(email);
  if (!admin) throw new Error('Invalid email or password');

  if (admin.password !== password) throw new Error('Invalid email or password');

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

  if (admin.password !== oldPassword) throw new Error('Current password is incorrect');

  await repo.updatePassword(adminId, newPassword);
  return true;
};
