const repo = require('./repository');

exports.submitReport = async (user, body) => {
  const isUser       = user.role === 'user'       || !user.role;
  const isAstrologer = user.role === 'astrologer';

  const data = {
    reported_by:            isUser ? 'user' : 'astrologer',
    reporter_user_id:       isUser       ? user.id : null,
    reporter_astrologer_id: isAstrologer ? user.id : null,
    reported_user_id:       body.reported_user_id       || null,
    reported_astrologer_id: body.reported_astrologer_id || null,
    reason:                 body.reason,
    description:            body.description || null
  };

  // Validation
  if (!data.reported_user_id && !data.reported_astrologer_id)
    throw new Error('reported_user_id or reported_astrologer_id required');
  if (!data.reason?.trim())
    throw new Error('reason is required');

  // Duplicate check
  const existing = await repo.findExisting(data);
  if (existing) throw new Error('You have already reported this person');

  const id = await repo.create(data);
  return { success: true, message: 'Report submitted successfully', data: { id } };
};

exports.getMyReports = async (user, query) => {
  const isUser = user.role === 'user' || !user.role;
  const result = await repo.getMyReports(
    isUser ? user.id : null,
    isUser ? null    : user.id,
    query.page,
    query.limit
  );
  return { success: true, ...result };
};
