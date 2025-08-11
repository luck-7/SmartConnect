import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const EnhancedChat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    fetchAvailableUsers();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Mock data - replace with actual API call
      const mockConversations = [
        {
          id: 1,
          name: user?.role === 'PATIENT' ? 'Dr. Sarah Johnson' : 'John Smith',
          role: user?.role === 'PATIENT' ? 'DOCTOR' : 'PATIENT',
          avatar: '/api/placeholder/40/40',
          lastMessage: 'How are you feeling today?',
          lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
          unreadCount: 2,
          online: true
        },
        {
          id: 2,
          name: user?.role === 'PATIENT' ? 'Dr. Michael Chen' : 'Sarah Wilson',
          role: user?.role === 'PATIENT' ? 'DOCTOR' : 'PATIENT',
          avatar: '/api/placeholder/40/40',
          lastMessage: 'Your test results are ready',
          lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
          unreadCount: 0,
          online: false
        },
        {
          id: 3,
          name: user?.role === 'PATIENT' ? 'Dr. Emily Davis' : 'Mike Johnson',
          role: user?.role === 'PATIENT' ? 'DOCTOR' : 'PATIENT',
          avatar: '/api/placeholder/40/40',
          lastMessage: 'Thank you for the update',
          lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          unreadCount: 1,
          online: true
        }
      ];
      
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      // Mock data for available users to start new chats
      const mockUsers = [
        { id: 4, name: 'Dr. Robert Wilson', role: 'DOCTOR', online: true },
        { id: 5, name: 'Dr. Lisa Anderson', role: 'DOCTOR', online: false },
        { id: 6, name: 'Dr. James Brown', role: 'DOCTOR', online: true }
      ];
      setAvailableUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching available users:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Mock messages data
      const mockMessages = [
        {
          id: 1,
          senderId: selectedConversation?.role === 'DOCTOR' ? 'doctor1' : 'patient1',
          senderName: selectedConversation?.name,
          content: 'Hello! How can I help you today?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'text'
        },
        {
          id: 2,
          senderId: user?.id,
          senderName: `${user?.firstName} ${user?.lastName}`,
          content: 'Hi, I have been experiencing some symptoms and wanted to discuss them.',
          timestamp: new Date(Date.now() - 90 * 60 * 1000),
          type: 'text'
        },
        {
          id: 3,
          senderId: selectedConversation?.role === 'DOCTOR' ? 'doctor1' : 'patient1',
          senderName: selectedConversation?.name,
          content: 'Of course! Please describe your symptoms in detail.',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          type: 'text'
        },
        {
          id: 4,
          senderId: user?.id,
          senderName: `${user?.firstName} ${user?.lastName}`,
          content: 'I have been having headaches and feeling tired for the past few days.',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          type: 'text'
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: Date.now(),
      senderId: user?.id,
      senderName: `${user?.firstName} ${user?.lastName}`,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation's last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: message.content, lastMessageTime: message.timestamp }
          : conv
      )
    );

    // Simulate response (in real app, this would come from WebSocket)
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        senderId: selectedConversation.role === 'DOCTOR' ? 'doctor1' : 'patient1',
        senderName: selectedConversation.name,
        content: getAutoResponse(message.content),
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const getAutoResponse = (messageContent) => {
    const responses = [
      "Thank you for sharing that information. I'll review it carefully.",
      "I understand your concern. Let me provide some guidance.",
      "That's helpful information. Based on what you've described...",
      "I appreciate you keeping me updated on your condition.",
      "Let me know if you have any other questions or concerns."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now - messageTime) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startNewChat = (selectedUser) => {
    const newConversation = {
      id: Date.now(),
      name: selectedUser.name,
      role: selectedUser.role,
      avatar: '/api/placeholder/40/40',
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0,
      online: selectedUser.online
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
    setMessages([]);
    setShowNewChatModal(false);
    toast.success(`Started new chat with ${selectedUser.name}`);
  };

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="spinner-border text-primary"></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="container-fluid py-4">
        <div className="row">
          {/* Conversations Sidebar */}
          <div className="col-lg-4 col-md-5">
            <div className="chat-sidebar">
              <div className="chat-sidebar-header">
                <h4 className="chat-title">
                  <i className="fas fa-comments"></i>
                  Messages
                </h4>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowNewChatModal(true)}
                >
                  <i className="fas fa-plus"></i>
                  New Chat
                </button>
              </div>

              <div className="chat-search">
                <div className="search-input-group">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="conversations-list">
                {filteredConversations.map(conversation => (
                  <div
                    key={conversation.id}
                    className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="conversation-avatar">
                      <div className="avatar-circle">
                        {conversation.name.charAt(0)}
                      </div>
                      {conversation.online && <div className="online-indicator"></div>}
                    </div>
                    
                    <div className="conversation-content">
                      <div className="conversation-header">
                        <h6 className="conversation-name">{conversation.name}</h6>
                        <span className="conversation-time">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <div className="conversation-preview">
                        <p className="last-message">{conversation.lastMessage}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="unread-badge">{conversation.unreadCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-lg-8 col-md-7">
            {selectedConversation ? (
              <div className="chat-area">
                <div className="chat-header">
                  <div className="chat-user-info">
                    <div className="chat-avatar">
                      <div className="avatar-circle">
                        {selectedConversation.name.charAt(0)}
                      </div>
                      {selectedConversation.online && <div className="online-indicator"></div>}
                    </div>
                    <div className="chat-user-details">
                      <h5 className="chat-user-name">{selectedConversation.name}</h5>
                      <p className="chat-user-status">
                        {selectedConversation.online ? (
                          <>
                            <i className="fas fa-circle text-success"></i>
                            Online
                          </>
                        ) : (
                          <>
                            <i className="fas fa-circle text-secondary"></i>
                            Offline
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="chat-actions">
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-video"></i>
                      Video Call
                    </button>
                    <button className="btn btn-outline-primary btn-sm">
                      <i className="fas fa-phone"></i>
                      Voice Call
                    </button>
                  </div>
                </div>

                <div className="chat-messages">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`message ${message.senderId === user?.id ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p className="message-text">{message.content}</p>
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  <div className="input-group">
                    <button className="btn btn-outline-secondary">
                      <i className="fas fa-paperclip"></i>
                    </button>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-conversation-selected">
                <div className="no-conversation-content">
                  <i className="fas fa-comments"></i>
                  <h4>Select a conversation</h4>
                  <p>Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Start New Chat</h5>
                <button 
                  className="btn-close"
                  onClick={() => setShowNewChatModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <h6>Available {user?.role === 'PATIENT' ? 'Doctors' : 'Patients'}</h6>
                <div className="available-users-list">
                  {availableUsers.map(availableUser => (
                    <div
                      key={availableUser.id}
                      className="available-user-item"
                      onClick={() => startNewChat(availableUser)}
                    >
                      <div className="user-avatar">
                        <div className="avatar-circle">
                          {availableUser.name.charAt(0)}
                        </div>
                        {availableUser.online && <div className="online-indicator"></div>}
                      </div>
                      <div className="user-info">
                        <h6>{availableUser.name}</h6>
                        <p className={availableUser.online ? 'text-success' : 'text-secondary'}>
                          {availableUser.online ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedChat;
