const mongoose = require('mongoose');

const buildViewFilter = (req) => {
  if (req.view === 'family' && req.familyGroup) {
    // Lấy tất cả userIds của members trong family group
    // member.userId có thể là ObjectId hoặc string, cần convert đúng
    const memberUserIds = req.familyGroup.members.map(member => {
      // Nếu là ObjectId thì giữ nguyên, nếu là string thì convert
      if (member.userId instanceof mongoose.Types.ObjectId) {
        return member.userId;
      }
      // Nếu là object (đã populate), lấy _id
      if (member.userId && member.userId._id) {
        return member.userId._id;
      }
      // Nếu là string, convert sang ObjectId
      return new mongoose.Types.ObjectId(member.userId);
    });
    
    // Debug log (có thể xóa sau)
    if (process.env.NODE_ENV === 'development') {
      console.log('[View Filter] Family mode:', {
        familyGroupId: req.familyGroup._id,
        memberCount: req.familyGroup.members.length,
        memberUserIds: memberUserIds.map(id => id.toString())
      });
    }
    
    // Đảm bảo familyGroupId được convert sang ObjectId nếu cần
    const familyGroupId = req.familyGroup._id instanceof mongoose.Types.ObjectId 
      ? req.familyGroup._id 
      : new mongoose.Types.ObjectId(req.familyGroup._id);
    
    // Trả về filter: items có familyGroupId = family._id HOẶC userId trong danh sách members
    // Điều này đảm bảo lấy được cả items cũ (chưa có familyGroupId) và items mới (có familyGroupId)
    return {
      $or: [
        { familyGroupId: familyGroupId },
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

/**
 * Merge viewFilter với các điều kiện query khác
 * Xử lý trường hợp viewFilter có $or để tránh conflict
 */
const mergeViewFilter = (viewFilter, additionalConditions = {}) => {
  // Nếu viewFilter có $or, cần dùng $and để merge
  if (viewFilter.$or) {
    return {
      $and: [
        viewFilter,
        additionalConditions
      ]
    };
  }
  
  // Nếu không có $or, merge bình thường
  return {
    ...viewFilter,
    ...additionalConditions
  };
};

module.exports = {
  buildViewFilter,
  buildAggregateMatch,
  resolveFamilyGroupId,
  mergeViewFilter
};
