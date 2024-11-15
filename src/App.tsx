import { useState } from 'react';
import { CommentBox } from './components/CommentBox';

export interface Comment {
  id: string;
  text: string;
  author: string;
  avatar: string;
  timestamp: Date;
  replies?: Comment[];
  level: number;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    text: 'This is an amazing video! Thanks for sharing your knowledge.',
    author: 'John Doe',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    timestamp: new Date('2024-03-15T10:00:00'),
    level: 0,
    replies: [
      {
        id: '2',
        text: 'Glad you found it helpful! 🙌',
        author: 'Content Creator',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Creator',
        timestamp: new Date('2024-03-15T10:30:00'),
        level: 1,
        replies: [],
      },
      {
        id: '3',
        text: 'Same here, learned a lot!',
        author: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        timestamp: new Date('2024-03-15T11:00:00'),
        level: 1,
        replies: [],
      },
    ],
  },
  {
    id: '4',
    text: 'Could you make a tutorial about React hooks next?',
    author: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    timestamp: new Date('2024-03-15T12:00:00'),
    level: 0,
    replies: [],
  },
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
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleReplySubmit = (parentId: string, replyText: string, level: number) => {
    console.log('Reply submitted:', { parentId, replyText, level });

    const newReply: Comment = {
      id: Date.now().toString(),
      text: replyText,
      author: 'Current User',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      timestamp: new Date(),
      replies: [],
      level: level + 1,
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

  return (
    <div className="p-4">
      <CommentBox
        comments={comments}
        userAvatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
        onSubmit={handleCommentSubmit}
        onReplySubmit={handleReplySubmit}
      />
    </div>
  );
}

export default App;
