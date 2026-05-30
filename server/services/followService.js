import { v4 as uuidv4 } from 'uuid';
import { findInArray, findAllInArray, addToArray, deleteFromArray } from '../utils/fileHandler.js';
import { ErrorMessages, ApiError, ErrorCodes } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

// Follow user
export const followUser = (followerId, followingId) => {
  try {
    // Cannot follow yourself
    if (followerId === followingId) {
      throw new ApiError(ErrorCodes.BAD_REQUEST, 'You cannot follow yourself');
    }

    // Check if already following
    const alreadyFollowing = findInArray(
      'follows.json',
      (f) => f.followerId === followerId && f.followingId === followingId
    );

    if (alreadyFollowing) {
      throw new ApiError(ErrorCodes.CONFLICT, 'You are already following this user');
    }

    // Create follow relationship
    const follow = {
      id: uuidv4(),
      followerId,
      followingId,
      createdAt: new Date().toISOString(),
    };

    const added = addToArray('follows.json', follow);
    if (!added) {
      throw new ApiError(ErrorCodes.INTERNAL_SERVER_ERROR, ErrorMessages.DATABASE_ERROR);
    }

    logger.info(`User ${followerId} followed ${followingId}`);
    return follow;
  } catch (error) {
    logger.error('Follow user error:', error.message);
    throw error;
  }
};

// Unfollow user
export const unfollowUser = (followerId, followingId) => {
  try {
    const deleted = deleteFromArray(
      'follows.json',
      (f) => f.followerId === followerId && f.followingId === followingId
    );

    if (!deleted) {
      throw new ApiError(ErrorCodes.NOT_FOUND, 'You are not following this user');
    }

    logger.info(`User ${followerId} unfollowed ${followingId}`);
    return { message: 'User unfollowed successfully' };
  } catch (error) {
    logger.error('Unfollow user error:', error.message);
    throw error;
  }
};

// Get followers of a user
export const getFollowers = (userId) => {
  try {
    const followers = findAllInArray('follows.json', (f) => f.followingId === userId);
    return followers.map((f) => f.followerId);
  } catch (error) {
    logger.error('Get followers error:', error.message);
    return [];
  }
};

// Get users followed by a user
export const getFollowing = (userId) => {
  try {
    const following = findAllInArray('follows.json', (f) => f.followerId === userId);
    return following.map((f) => f.followingId);
  } catch (error) {
    logger.error('Get following error:', error.message);
    return [];
  }
};

// Check if user follows another user
export const isFollowing = (followerId, followingId) => {
  try {
    const follow = findInArray(
      'follows.json',
      (f) => f.followerId === followerId && f.followingId === followingId
    );
    return !!follow;
  } catch (error) {
    logger.error('Is following check error:', error.message);
    return false;
  }
};

// Get followers count
export const getFollowersCount = (userId) => {
  try {
    return getFollowers(userId).length;
  } catch (error) {
    logger.error('Get followers count error:', error.message);
    return 0;
  }
};

// Get following count
export const getFollowingCount = (userId) => {
  try {
    return getFollowing(userId).length;
  } catch (error) {
    logger.error('Get following count error:', error.message);
    return 0;
  }
};

export default {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  isFollowing,
  getFollowersCount,
  getFollowingCount,
};
