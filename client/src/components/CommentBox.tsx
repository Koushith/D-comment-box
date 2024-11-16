import { useState, FormEvent, useRef, useEffect } from 'react';
import type { Comment, User, Like } from '../App';

interface CommentBoxProps {
  currentUser: User;
  comments: Comment[];
  onSubmit: (comment: string) => void;
  onReplySubmit: (parentId: string, reply: string, level: number) => void;
  onLikeClick: (commentId: string, isLike: boolean) => void;
}

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just now';
  }
};

export function CommentBox({ currentUser, comments, onSubmit, onReplySubmit, onLikeClick }: CommentBoxProps) {
  const [comment, setComment] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [showLikesPopup, setShowLikesPopup] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowLikesPopup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSubmit(comment);
    setComment('');
    setIsFocused(false);
  };

  const handleReplySubmit = (e: FormEvent, parentId: string, level: number) => {
    e.preventDefault();
    const reply = replyText[parentId];
    if (!reply?.trim()) return;

    onReplySubmit(parentId, reply, level);
    setReplyText((prev) => ({ ...prev, [parentId]: '' }));
    setReplyingTo(null);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    return (
      <div className={`flex gap-3 ${isReply ? 'ml-[52px]' : ''} ${isReply ? 'mt-3' : 'mt-4'}`}>
        <img src={comment.avatar} alt={`${comment.author}'s avatar`} className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-medium text-[13px] text-[#0f0f0f]">{comment.author}</span>
            <span className="text-[12px] text-[#606060]">{formatTimestamp(comment.timestamp)}</span>
          </div>
          <p className="mt-1 text-[14px] text-[#0f0f0f] whitespace-pre-wrap">{comment.text}</p>

          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-2">
              <LikeButton comment={comment} />
            </div>
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="text-[13px] font-medium text-[#606060] hover:bg-[#f2f2f2] px-3 py-2 rounded-full"
            >
              Reply
            </button>
          </div>

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              <button className="flex items-center gap-2 text-[14px] font-medium text-[#065fd4] hover:bg-[#def1ff] px-3 py-1 rounded-full">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 8.5l6 6H6l6-6z" />
                </svg>
                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
              </button>
              <div className="mt-1 border-l border-[#eee] pl-[2px]">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            </div>
          )}

          {replyingTo === comment.id && (
            <div className="mt-3 ml-[-40px]">
              <form onSubmit={(e) => handleReplySubmit(e, comment.id, comment.level)} className="flex-1">
                <div className="flex gap-3">
                  <img src={currentUser.avatar} alt="Your avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={replyText[comment.id] || ''}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      placeholder={`Reply to @${comment.author}`}
                      className="w-full min-h-[40px] text-[14px] px-0 py-1 border-b border-[#909090] resize-none focus:outline-none focus:border-b-2 focus:border-[#0f0f0f]"
                      rows={1}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText((prev) => ({ ...prev, [comment.id]: '' }));
                        }}
                        className="px-3 py-1.5 text-[14px] font-medium text-[#606060] hover:bg-[#f2f2f2] rounded-full"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!replyText[comment.id]?.trim()}
                        className="px-3 py-1.5 text-[14px] font-medium bg-[#065fd4] text-white rounded-full disabled:bg-[#f2f2f2] disabled:text-[#909090]"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  const LikeButton = ({ comment }: { comment: Comment }) => {
    return (
      <div className="relative flex items-center gap-2">
        <button
          onClick={() => onLikeClick(comment.id, true)}
          className="p-2 hover:bg-[#f2f2f2] rounded-full group flex items-center gap-1"
        >
          <svg
            className={`w-5 h-5 ${comment.isLiked ? 'text-[#065fd4]' : 'text-[#606060]'}`}
            fill={comment.isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          {comment.likes.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLikesPopup(comment.id);
              }}
              className={`text-[13px] ${comment.isLiked ? 'text-[#065fd4]' : 'text-[#606060]'} hover:underline`}
            >
              {comment.likes.length}
            </button>
          )}
        </button>
        <button onClick={() => onLikeClick(comment.id, false)} className="p-2 hover:bg-[#f2f2f2] rounded-full">
          <svg
            className={`w-5 h-5 ${comment.isDisliked ? 'text-[#065fd4]' : 'text-[#606060]'}`}
            fill={comment.isDisliked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"
            />
          </svg>
        </button>

        {showLikesPopup === comment.id && (
          <div
            ref={popupRef}
            className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px] z-10"
          >
            <h3 className="text-[14px] font-medium mb-2">Liked by</h3>
            <div className="max-h-[300px] overflow-y-auto">
              {comment.likes.map((like) => (
                <div key={like.userId} className="flex items-center gap-2 py-2">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${like.userId}`}
                    alt="User avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <p className="text-[13px] font-medium">{like.userId}</p>
                    <p className="text-[12px] text-gray-500">{formatTimestamp(like.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-[1000px] w-full">
      <div className="mb-8">
        <h2 className="text-[16px] font-medium mb-6">{comments.length} Comments</h2>
        <div className="flex gap-3">
          <img src={currentUser.avatar} alt="Your avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="relative w-full">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onFocus={() => setIsFocused(true)}
                placeholder="Add a comment..."
                className="w-full min-h-[40px] text-[14px] px-0 py-1 border-b border-[#909090] resize-none focus:outline-none focus:border-b-2 focus:border-[#0f0f0f]"
                rows={isFocused ? 2 : 1}
              />
            </div>

            {isFocused && (
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(false);
                    setComment('');
                  }}
                  className="px-3 py-1.5 text-[14px] font-medium text-[#606060] hover:bg-[#f2f2f2] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!comment.trim()}
                  className="px-3 py-1.5 text-[14px] font-medium bg-[#065fd4] text-white rounded-full disabled:bg-[#f2f2f2] disabled:text-[#909090]"
                >
                  Comment
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
