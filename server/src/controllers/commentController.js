import Comment from '../model/Comment.js';
import Like from '../model/Like.js';

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ parentId: null }).sort({ createdAt: -1 }).populate('author').lean();

    const populatedComments = await populateCommentsWithRepliesAndLikes(comments);

    res.json(populatedComments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
};

const populateCommentsWithRepliesAndLikes = async (comments) => {
  const populatedComments = await Promise.all(
    comments.map(async (comment) => {
      // Get replies
      const replies = await Comment.find({ parentId: comment._id }).sort({ createdAt: -1 }).populate('author').lean();

      // Get likes
      const likes = await Like.find({ commentId: comment._id }).populate('userId').lean();

      // Recursively populate replies
      const populatedReplies = replies.length > 0 ? await populateCommentsWithRepliesAndLikes(replies) : [];

      return {
        id: comment._id.toString(),
        text: comment.text,
        author: {
          id: comment.author._id.toString(),
          name: comment.author.name,
          avatar: comment.author.avatar,
        },
        likes: likes.map((like) => ({
          userId: like.userId._id.toString(),
          timestamp: like.createdAt,
        })),
        replies: populatedReplies,
        level: comment.level,
        isEdited: comment.isEdited,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    })
  );

  return populatedComments;
};
