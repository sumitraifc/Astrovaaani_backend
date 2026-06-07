const service = require('./service');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', email);
    console.log('Request body:', req.body); 
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' });

    const result = await service.login(email, password);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    if (!old_password || !new_password)
      return res.status(400).json({ success: false, message: 'Both passwords required' });

    await service.changePassword(req.admin.id, old_password, new_password);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
