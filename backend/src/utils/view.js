const mongoose = require('mongoose');

const buildViewFilter = (req) => {
  if (req.view === 'family' && req.familyGroup) {
    // Lấy tất cả userIds của members trong family group
    const memberUserIds = req.familyGroup.members.map(member => member.userId);
    
    // Trả về filter: items có familyGroupId = family._id HOẶC userId trong danh sách members
    // Điều này đảm bảo lấy được cả items cũ (chưa có familyGroupId) và items mới (có familyGroupId)
    return {
      $or: [
        { familyGroupId: req.familyGroup._id },
        { userId: { $in: memberUserIds }, familyGroupId: null }
      ]
    };
  }

  return { userId: req.user.id, familyGroupId: null };
};

const buildAggregateMatch = (req) => {
  if (req.view === 'family' && req.familyGroup) {
    // Lấy tất cả userIds của members trong family group
    const memberUserIds = req.familyGroup.members.map(member => 
      new mongoose.Types.ObjectId(member.userId)
    );
    
    // Trả về match: items có familyGroupId = family._id HOẶC userId trong danh sách members
    return {
      $or: [
        { familyGroupId: new mongoose.Types.ObjectId(req.familyGroup._id) },
        { 
          userId: { $in: memberUserIds }, 
          familyGroupId: null 
        }
      ]
    };
  }

  return {
    userId: new mongoose.Types.ObjectId(req.user.id),
    familyGroupId: null
  };
};

const resolveFamilyGroupId = (req) => {
  if (req.view === 'family' && req.familyGroup) {
    return req.familyGroup._id;
  }

  return null;
};

module.exports = {
  buildViewFilter,
  buildAggregateMatch,
  resolveFamilyGroupId
};
