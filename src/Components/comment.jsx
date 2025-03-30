import { useState } from 'react';
import PropTypes from 'prop-types';
import { Reply, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  // Add a reply to this comment
  const handleAddReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const newReply = {
        id: `r${Date.now()}`,
        content: replyContent,
        author: {
          name: 'Current User',
          avatar: '/placeholder.svg?height=40&width=40',
        },
        upvotes: 0,
        downvotes: 0,
        timestamp: new Date().toISOString(),
        replies: [],
      };

      const updateCommentReplies = (comments, targetId, newReply) => {
        return comments.map((c) => {
          if (c.id === targetId) {
            return {
              ...c,
              replies: [...(Array.isArray(c.replies) ? c.replies : []), newReply],
            };
          } else if (c.replies && c.replies.length > 0) {
            return {
              ...c,
              replies: updateCommentReplies(c.replies, targetId, newReply),
            };
          }
          return c;
        });
      };

      if (parentComments.length > 0) {
        let updatedComments = [...parentComments];
        updatedComments = updateCommentReplies(updatedComments, comment.id, newReply);
        onUpdateComments(updatedComments);
      } else {
        const updatedComment = {
          ...comment,
          replies: [...(Array.isArray(comment.replies) ? comment.replies : []), newReply],
        };
        onUpdateComments((prevComments) =>
          prevComments.map((c) => (c.id === comment.id ? updatedComment : c)),
        );
      }

      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const maxDepth = 4;

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Report</DropdownMenuItem>
                    <DropdownMenuItem>Copy Text</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  key={reply.replyid}
                  comment={{
                    ...reply,
                    id: reply.replyid,
                    content: reply.replycontent,
                    author: reply.replyauthor,
                    timestamp: formatRelativeTime(reply.replytimestamp),
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
