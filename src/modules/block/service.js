const repo = require('./repository');

const buildBlockData = (user, targetId, targetType) => {
  const isUser       = user.role === 'user' || !user.role;
  const isAstrologer = user.role === 'astrologer';

  return {
    blocker_type:           isUser ? 'user' : 'astrologer',
    blocker_user_id:        isUser       ? user.id : null,
    blocker_astrologer_id:  isAstrologer ? user.id : null,
    blocked_user_id:        targetType === 'user'       ? parseInt(targetId) : null,
    blocked_astrologer_id:  targetType === 'astrologer' ? parseInt(targetId) : null
  };
};

exports.block = async (user, targetId, targetType) => {
  if (!['user', 'astrologer'].includes(targetType))
    throw new Error('targetType must be user or astrologer');

  const data = buildBlockData(user, targetId, targetType);
  await repo.block(data);
  return { success: true, message: 'Blocked successfully' };
};

exports.unblock = async (user, targetId, targetType) => {
  if (!['user', 'astrologer'].includes(targetType))
    throw new Error('targetType must be user or astrologer');

  const data = buildBlockData(user, targetId, targetType);
  await repo.unblock(data);
  return { success: true, message: 'Unblocked successfully' };
};

exports.getBlockList = async (user, query) => {
  const isUser = user.role === 'user' || !user.role;

  if (isUser) {
    const result = await repo.getBlockedAstrologers(user.id, query.page, query.limit);
    return { success: true, ...result };
  } else {
    const result = await repo.getBlockedUsers(user.id, query.page, query.limit);
    return { success: true, ...result };
  }
};

exports.checkBlock = async (user, targetId, targetType) => {
  const data = buildBlockData(user, targetId, targetType);
  const blocked = await repo.isBlocked(data);
  return { success: true, is_blocked: blocked };
};
