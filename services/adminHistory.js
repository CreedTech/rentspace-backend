const AdminHistory = require("../models/AdminHistory");

const recordAdminLogin = async (admin) => {
  const adminHistoryEntry = new AdminHistory({
    user:admin._id,
    action: 'login',
    email: admin.email,
    id: admin._id,
    in: new Date(),
    role: admin.role,
  });

  await adminHistoryEntry.save();
};

const recordAdminLogout = async (admin) => {
  const adminHistoryEntry = new AdminHistory({
    user:admin._id,
    action: 'logout',
    email: admin.email,
    id: admin._id,
    out: new Date(),
    role: admin.role,
  });

  await adminHistoryEntry.save();
};

module.exports = { recordAdminLogin, recordAdminLogout };
