import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Reply } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import API from '../api';

// Utility function to format relative time
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return 'Just now';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = Math.floor(seconds / 60);
  if (interval < 1) return 'Just now';
  if (interval < 60) return `${interval} minute${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval < 24) return `${interval} hour${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval < 7) return `${interval} day${interval > 1 ? 's' : ''} ago`;

  interval = Math.floor(seconds / 604800);
  return `${interval} week${interval > 1 ? 's' : ''} ago`;
};

export function Comment({
  comment,
  postId,
  roomId,
  onUpdateComments,
  depth = 0, // Default parameter
  parentComments = [], // Default parameter
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [session, setSession] = useState(null);

  // Fetch session data from localStorage on initial render
    useEffect(() => {
      const savedSession = localStorage.getItem('session');
      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }
    }, []);

  // Add a reply to this comment
  const handleAddReply = async () => {
    if (!replyContent.trim()) return;
  
    try {
      const replyAuthor = {
        name: `${session?.firstname || ''} ${session?.lastname || ''}`.trim() || 'Anonymous',
        avatar: session?.profilePic || '/placeholder.svg',
      };
  
      const response = await API.post('/room/reply/comment', {
        roomId,
        postId,
        commentid: comment.id,
        replycontent: replyContent,
        replyauthor: replyAuthor,
      });
  
      if (response.data && response.data.reply) {
        const newReply = response.data.reply;
  
        const updatedComment = {
          ...comment,
          replies: [...(Array.isArray(comment.replies) ? comment.replies : []), newReply],
        };
  
        // Update the parent comments state
        if (parentComments.length > 0) {
          const updateNestedComment = (comments, targetId, updatedComment) => {
            return comments.map((c) =>
              c.id === targetId
                ? updatedComment
                : c.replies && c.replies.length > 0
                ? {
                    ...c,
                    replies: updateNestedComment(c.replies, targetId, updatedComment),
                  }
                : c,
            );
          };
  
          const updatedComments = updateNestedComment(parentComments, comment.id, updatedComment);
          onUpdateComments(updatedComments);
        } else {
          onUpdateComments((prevComments) =>
            prevComments.map((c) => (c.id === comment.id ? updatedComment : c)),
          );
        }
  
        setReplyContent('');
        setIsReplying(false);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const maxDepth = 1;

  return (
    <div className={`pl-${depth > 0 ? 4 : 0}`}>
      <div className="flex gap-3">
        {/* Indentation for nested comments */}
        {depth > 0 && <div className="w-0.5 bg-slate-200 rounded-full self-stretch ml-2 mr-1" />}
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={comment.author?.avatar || '/placeholder.svg'}
                alt={comment.author?.name || 'Anonymous'}
              />
              <AvatarFallback>{comment.author?.name ? comment.author.name[0] : 'A'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{comment.author?.name || 'Anonymous'}</span>
                <span className="text-xs text-muted-foreground">
                  • {formatRelativeTime(comment.timestamp)}
                </span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
              <div className="flex items-center gap-2 mt-2">
                {depth < maxDepth && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
              {/* Reply form */}
              {isReplying && (
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handleAddReply} disabled={!replyContent.trim()}>
                    Reply
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Nested replies */}
          {comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.replyid} // Use replyid as the key
                  comment={{
                    ...reply,
                    id: reply.replyid || reply.id, // Ensure id is assigned
                    content: reply.replycontent,
                    author: reply.replyauthor,
                    timestamp: reply.replytimestamp,
                    replies: reply.commentreplies || [],
                  }}
                  postId={postId}
                  roomId={roomId}
                  depth={depth + 1}
                  parentComments={parentComments.length > 0 ? parentComments : [comment]}
                  onUpdateComments={(updatedReplies) => {
                    const updatedComment = {
                      ...comment,
                      replies: updatedReplies,
                    };

                    if (parentComments.length > 0) {
                      const updateNestedComment = (comments, targetId, updatedComment) => {
                        return comments.map((c) =>
                          c.id === targetId
                            ? updatedComment
                            : c.replies && c.replies.length > 0
                            ? {
                                ...c,
                                replies: updateNestedComment(c.replies, targetId, updatedComment),
                              }
                            : c,
                        );
                      };

                      const updatedComments = updateNestedComment(
                        parentComments,
                        comment.id,
                        updatedComment,
                      );
                      onUpdateComments(updatedComments);
                    } else {
                      onUpdateComments((prevComments) =>
                        prevComments.map((c) => (c.id === comment.id ? updatedComment : c)),
                      );
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add PropTypes validation
Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
    upvotes: PropTypes.number,
    downvotes: PropTypes.number,
    timestamp: PropTypes.string,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        author: PropTypes.shape({
          name: PropTypes.string.isRequired,
          avatar: PropTypes.string.isRequired,
        }).isRequired,
        upvotes: PropTypes.number,
        downvotes: PropTypes.number,
        timestamp: PropTypes.string,
        replies: PropTypes.array,
      }),
    ),
  }).isRequired,
  postId: PropTypes.string.isRequired,
  roomId: PropTypes.string.isRequired,
  onUpdateComments: PropTypes.func.isRequired,
  depth: PropTypes.number,
  parentComments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
      upvotes: PropTypes.number,
      downvotes: PropTypes.number,
      timestamp: PropTypes.string,
      replies: PropTypes.array,
    }),
  ),
};
