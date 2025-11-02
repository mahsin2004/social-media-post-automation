'use client';
import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  ChevronDown,
  ChevronRight,
  User,
  Clock,
  Heart,
  Reply,
  Check,
  Zap,
  Settings,
  Filter,
  Search
} from 'lucide-react';

type Account = {
  id: string;
  name: string;
  platform: string;
  icon: string;
  color: string;
  unread: number;
};

type Conversation = {
  id: string;
  author: string;
  message: string;
  time: string;
  hasUniqueQuestion: boolean;
  isRepetitive: boolean;
  aiSuggestion?: string;
};

type Comment = {
  id: number;
  author: string;
  text: string;
  time: string;
  isRepetitive?: boolean;
  isUnique?: boolean;
  replies?: Comment[];
};

type Post = {
  id: string;
  author: string;
  date: string;
  content: string;
  likes: number;
  comments: Comment[];
};

const Messages: React.FC = () => {
  const [selectedAccount, setSelectedAccount] = useState<string>('gaming-yt');
  const [selectedPostId, setSelectedPostId] = useState<string | null>('post-123');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [autoReplyEnabled, setAutoReplyEnabled] = useState<boolean>(true);
  const [replyText, setReplyText] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'unique' | 'repetitive'>('all');

  // Mock data
  const socialAccounts: Account[] = [
    { id: 'gaming-yt', name: 'GAMING YT', platform: 'YouTube', icon: 'Y', color: 'bg-red-500', unread: 12 },
    { id: 'tech-channel', name: 'Tech Reviews Pro', platform: 'YouTube', icon: 'Y', color: 'bg-red-500', unread: 5 },
    { id: 'instagram-main', name: '@creativestudio', platform: 'Instagram', icon: 'I', color: 'bg-gradient-to-r from-purple-500 to-pink-500', unread: 23 },
    { id: 'twitter-biz', name: '@BusinessGrowth', platform: 'Twitter', icon: 'X', color: 'bg-blue-400', unread: 8 },
  ];

  const conversations: Conversation[] = [
    {
      id: 'animated-tutorial',
      author: 'ANIMATED TUTORIAL VIDEOS',
      message: 'kik',
      time: '3 y ago',
      hasUniqueQuestion: false,
      isRepetitive: true,
      aiSuggestion: 'Thanks for watching! 🎮'
    },
    {
      id: 'lamar-keenum',
      author: 'Lamar Keenum',
      message: 'P_m_m',
      time: '3 y ago',
      hasUniqueQuestion: false,
      isRepetitive: true,
      aiSuggestion: 'Glad you enjoyed it!'
    },
    {
      id: 'john-doe',
      author: 'John Doe',
      message: 'How did you create that animation effect at 2:45? What software did you use?',
      time: '2 d ago',
      hasUniqueQuestion: true,
      isRepetitive: false,
      aiSuggestion: 'Unique question detected - requires personal response'
    },
    {
      id: 'sarah-mike',
      author: 'Sarah Mike',
      message: 'Amazing!',
      time: '1 w ago',
      hasUniqueQuestion: false,
      isRepetitive: true,
      aiSuggestion: 'Thank you so much! 🙏'
    },
  ];

  // Example posts array (could come from props / api)
  const posts: Post[] = [
    {
      id: 'post-123',
      author: 'GAMING & SPORTS YT // MR. MJ',
      date: 'Sep 8, 2022, 10:37 PM',
      content: 'Gaming sports....SPORTS gaming....Mr mj....Mr mj....FUNNY...prank sports......free FIRE ......Gaming & SPORTS YT // mr mj...',
      likes: 245,
      comments: [
        { id: 1, author: 'ANIMATED TUTORIAL VIDEOS', text: 'kik', time: '3 y ago', isRepetitive: true, replies: [] },
        { id: 2, author: 'Lamar Keenum', text: 'P_m_m', time: '3 y ago', isRepetitive: true, replies: [] },
        {
          id: 3,
          author: 'John Doe',
          text: 'How did you create that animation effect at 2:45? What software did you use?',
          time: '2 d ago',
          isRepetitive: false,
          isUnique: true,
          replies: []
        },
        { id: 4, author: 'Sarah Mike', text: 'Amazing!', time: '1 w ago', isRepetitive: true, replies: [] },
        { id: 5, author: 'Alex Turner', text: 'Great video!', time: '5 d ago', isRepetitive: true, replies: [] },
      ]
    },
    {
      id: 'post-124',
      author: 'Tech Reviews Pro',
      date: 'Oct 1, 2023, 11:00 AM',
      content: 'New review: best budget laptop for creators — quick highlights and benchmarks.',
      likes: 87,
      comments: [
        { id: 10, author: 'Jane Doe', text: 'Awesome review!', time: '2 d ago', isRepetitive: true, replies: [] },
        { id: 11, author: 'Sam', text: 'What about battery life?', time: '1 d ago', isRepetitive: false, isUnique: true, replies: [] },
      ]
    },
    // add more posts as needed...
  ];

  const selectedPost: Post | undefined = posts.find(p => p.id === selectedPostId) ?? posts[0];

  const toggleComment = (commentId: number | string) => {
    const key = String(commentId);
    setExpandedComments(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAutoReply = (commentId: number | string) => {
    console.log('Auto-replying to comment:', commentId);
    // implement reply logic / API call here
  };

  const filteredComments = (selectedPost?.comments ?? []).filter(comment => {
    if (filter === 'unique') return !!comment.isUnique;
    if (filter === 'repetitive') return !!comment.isRepetitive;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-pink-50 to-pink-100 p-2">
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Manage Engagement
            </h1>
            <p className="text-gray-600 mt-1">AI-powered comment management & auto-reply system</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-pink-200">
              <Sparkles className={`w-5 h-5 ${autoReplyEnabled ? 'text-purple-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium text-gray-700">AI Auto-Reply</span>
              <button
                onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${autoReplyEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-300'}`}
                aria-pressed={autoReplyEnabled}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoReplyEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
            <button className="p-2 bg-white rounded-xl shadow-sm border border-pink-200 hover:bg-pink-50 transition-colors" aria-label="settings">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left Panel - Social Accounts */}
          <div className="col-span-3 bg-white rounded-2xl shadow-lg border border-pink-200 p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Connected Accounts</h2>
              <button className="text-purple-600 hover:text-purple-700" aria-label="add account">
                <span className="text-2xl">+</span>
              </button>
            </div>
            <div className="space-y-3">
              {socialAccounts.map(account => (
                <button
                  key={account.id}
                  onClick={() => setSelectedAccount(account.id)}
                  className={`w-full p-4 rounded-xl transition-all ${selectedAccount === account.id ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-purple-400 shadow-md' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center text-xl`}>
                      {account.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-800 text-sm truncate">{account.name}</div>
                      <div className="text-xs text-gray-500">{account.platform}</div>
                    </div>
                    {account.unread > 0 && (
                      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {account.unread}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle Panel - Posts (click a post to show details right) */}
          <div className="col-span-4 bg-white rounded-2xl shadow-lg border border-pink-200 p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex-1">Posts</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="filter posts">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[700px] overflow-y-auto">
              {posts.map(post => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPostId(post.id)}
                  className={`w-full p-4 rounded-xl transition-all text-left ${selectedPostId === post.id ? 'bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-purple-400' : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                      {post.author[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-800 text-sm truncate">{post.author}</span>
                        <span className="text-xs text-gray-500">{post.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{post.comments.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Panel - Selected Post Details & Comments */}
          <div className="col-span-5 bg-white rounded-2xl shadow-lg border border-pink-200 p-6">
            {selectedPost ? (
              <>
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl">
                      🎮
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{selectedPost.author}</h3>
                      <p className="text-sm text-gray-500">{selectedPost.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-3">{selectedPost.content}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{selectedPost.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">{selectedPost.comments.length}</span>
                    </div>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    All ({selectedPost.comments.length})
                  </button>
                  <button
                    onClick={() => setFilter('unique')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'unique' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Unique ({selectedPost.comments.filter(c => c.isUnique).length})
                  </button>
                  <button
                    onClick={() => setFilter('repetitive')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'repetitive' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    Repetitive ({selectedPost.comments.filter(c => c.isRepetitive).length})
                  </button>
                </div>

                {/* Comments */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredComments.map(comment => (
                    <div
                      key={comment.id}
                      className={`rounded-xl border-2 transition-all ${comment.isUnique ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-orange-300' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <button onClick={() => toggleComment(comment.id)} className="w-full p-4 text-left">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {comment.author[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-800 text-sm">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.time}</span>
                              {comment.isUnique && (
                                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium ml-auto">
                                  NEEDS ATTENTION
                                </span>
                              )}
                              {comment.isRepetitive && autoReplyEnabled && (
                                <Sparkles className="w-4 h-4 text-purple-500 ml-auto" />
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{comment.text}</p>
                          </div>
                          {expandedComments[String(comment.id)] ? (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </button>

                      {expandedComments[String(comment.id)] && (
                        <div className="px-4 pb-4 border-t border-gray-200 mt-2 pt-3">
                          {comment.isRepetitive && autoReplyEnabled ? (
                            <div className="bg-white p-3 rounded-lg border border-purple-200 mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <span className="text-xs font-semibold text-purple-700">AI Suggested Reply</span>
                              </div>
                              <p className="text-sm text-gray-700 mb-3">{/* ideally use comment-specific suggestion */}Thanks for watching! 🎮</p>
                              <button
                                onClick={() => handleAutoReply(comment.id)}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                              >
                                <Zap className="w-4 h-4" />
                                Send AI Reply
                              </button>
                            </div>
                          ) : (
                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 mb-3">
                              <p className="text-xs text-amber-800 font-medium">
                                ⚠️ Unique question detected - Please provide a personalized response
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a personal reply..."
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:shadow-lg transition-all" aria-label="send reply">
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-500">Select a post from the middle column to see details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
