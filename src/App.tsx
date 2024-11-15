import { useState } from 'react';
import { CommentBox } from './components/CommentBox';

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Like {
  userId: string;
  timestamp: Date;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  avatar: string;
  timestamp: Date;
  replies?: Comment[];
  level: number;
  likes: Like[];
  isLiked: boolean;
  isDisliked: boolean;
}

// Mock current user
export const CURRENT_USER: User = {
  id: 'current-user',
  name: 'Current User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
};

const MOCK_USERS: User[] = [
  { id: 'user1', name: 'John Doe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John' },
  { id: 'user2', name: 'Jane Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane' },
  // Add more mock users
];

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    text: 'This is an amazing video!',
    author: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    timestamp: new Date('2024-03-15T10:00:00'),
    level: 0,
    likes: [
      { userId: 'user1', timestamp: new Date('2024-03-15T10:30:00') },
      { userId: 'user2', timestamp: new Date('2024-03-15T11:00:00') },
    ],
    isLiked: false,
    isDisliked: false,
    replies: [],
  },
  // ... other mock comments
];

function App() {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);

  const handleCommentSubmit = (comment: string) => {
    console.log('Comment submitted:', comment);
    const newComment: Comment = {
      id: Date.now().toString(),
      text: comment,
      author: 'Current User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      timestamp: new Date(),
      replies: [],
      level: 0,
      likes: [],
      isLiked: false,
      isDisliked: false,
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleReplySubmit = (parentId: string, replyText: string, level: number) => {
    console.log(comments);

    const newReply: Comment = {
      id: Date.now().toString(),
      text: replyText,
      author: 'Current User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      timestamp: new Date(),
      replies: [],
      level: level + 1,
      likes: [],
      isLiked: false,
      isDisliked: false,
    };

    const updateReplies = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [newReply, ...(comment.replies || [])],
          };
        }
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: updateReplies(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments((prevComments) => updateReplies(prevComments));
  };

  const handleLikeClick = (commentId: string, isLike: boolean) => {
    const updateCommentLikes = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          const wasLiked = comment.isLiked;
          const wasDisliked = comment.isDisliked;

          let updatedLikes = [...comment.likes];
          if (isLike) {
            if (wasLiked) {
              // Remove like
              updatedLikes = updatedLikes.filter((like) => like.userId !== CURRENT_USER.id);
            } else {
              // Add like
              updatedLikes.push({
                userId: CURRENT_USER.id,
                timestamp: new Date(),
              });
            }
          }

          return {
            ...comment,
            likes: updatedLikes,
            isLiked: isLike ? !wasLiked : false,
            isDisliked: isLike ? false : !wasDisliked,
          };
        }
        if (comment.replies?.length) {
          return {
            ...comment,
            replies: updateCommentLikes(comment.replies),
          };
        }
        return comment;
      });
    };

    setComments((prev) => updateCommentLikes(prev));
  };

  return (
    <div className="p-4">
      <CommentBox
        currentUser={CURRENT_USER}
        comments={comments}
        onSubmit={handleCommentSubmit}
        onReplySubmit={handleReplySubmit}
        onLikeClick={handleLikeClick}
      />
    </div>
  );
}

export default App;
