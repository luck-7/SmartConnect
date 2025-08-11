import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
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
          lastMessage: 'How are you feeling today?',
          lastMessageTime: '10:30 AM',
          unreadCount: 2,
          online: true
        },
        {
          id: 2,
          name: user?.role === 'PATIENT' ? 'Dr. Michael Chen' : 'Sarah Wilson',
          role: user?.role === 'PATIENT' ? 'DOCTOR' : 'PATIENT',
          lastMessage: 'Your test results are ready',
          lastMessageTime: 'Yesterday',
          unreadCount: 0,
          online: false
        }
      ];
      
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setSelectedConversation(mockConversations[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Mock messages - replace with actual API call
      const mockMessages = [
        {
          id: 1,
          senderId: user?.role === 'PATIENT' ? 2 : 1,
          senderName: user?.role === 'PATIENT' ? 'Dr. Sarah Johnson' : 'John Smith',
          content: 'Hello! How are you feeling today?',
          timestamp: '2024-01-15 09:00:00',
          isOwn: false
        },
        {
          id: 2,
          senderId: user?.id,
          senderName: user?.firstName + ' ' + user?.lastName,
          content: 'Hi Doctor, I\'m feeling much better after taking the medication.',
          timestamp: '2024-01-15 09:05:00',
          isOwn: true
        },
        {
          id: 3,
          senderId: user?.role === 'PATIENT' ? 2 : 1,
          senderName: user?.role === 'PATIENT' ? 'Dr. Sarah Johnson' : 'John Smith',
          content: 'That\'s great to hear! Are you experiencing any side effects?',
          timestamp: '2024-01-15 09:10:00',
          isOwn: false
        },
        {
          id: 4,
          senderId: user?.id,
          senderName: user?.firstName + ' ' + user?.lastName,
          content: 'No side effects so far. Should I continue with the same dosage?',
          timestamp: '2024-01-15 09:15:00',
          isOwn: true
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      senderId: user?.id,
      senderName: user?.firstName + ' ' + user?.lastName,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation?.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: 'Now' }
          : conv
      )
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="container-fluid py-4">
        <div className="row">
          {/* Conversations List */}
          <div className="col-lg-4 col-md-5">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="fas fa-comments me-2"></i>
                  Messages
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`list-group-item list-group-item-action cursor-pointer ${
                        selectedConversation?.id === conversation.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="position-relative me-3">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                               style={{ width: '40px', height: '40px' }}>
                            <i className={`fas ${conversation.role === 'DOCTOR' ? 'fa-user-md' : 'fa-user'}`}></i>
                          </div>
                          {conversation.online && (
                            <span className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                                  style={{ width: '12px', height: '12px', border: '2px solid white' }}></span>
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="mb-1">{conversation.name}</h6>
                            <small className="text-muted">{conversation.lastMessageTime}</small>
                          </div>
                          <p className="mb-1 text-muted small">{conversation.lastMessage}</p>
                          {conversation.unreadCount > 0 && (
                            <span className="badge bg-primary rounded-pill">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-lg-8 col-md-7">
            {selectedConversation ? (
              <div className="card h-100 d-flex flex-column">
                {/* Chat Header */}
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="position-relative me-3">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                             style={{ width: '40px', height: '40px' }}>
                          <i className={`fas ${selectedConversation.role === 'DOCTOR' ? 'fa-user-md' : 'fa-user'}`}></i>
                        </div>
                        {selectedConversation.online && (
                          <span className="position-absolute bottom-0 end-0 bg-success rounded-circle"
                                style={{ width: '12px', height: '12px', border: '2px solid white' }}></span>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0">{selectedConversation.name}</h6>
                        <small className="text-muted">
                          {selectedConversation.online ? 'Online' : 'Offline'}
                        </small>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-2">
                        <i className="fas fa-video"></i>
                      </button>
                      <button className="btn btn-outline-primary btn-sm">
                        <i className="fas fa-phone"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="card-body flex-grow-1 overflow-auto" style={{ maxHeight: '400px' }}>
                  <div className="messages-container">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`d-flex mb-3 ${message.isOwn ? 'justify-content-end' : 'justify-content-start'}`}
                      >
                        <div className={`message p-3 rounded ${
                          message.isOwn 
                            ? 'bg-primary text-white ms-5' 
                            : 'bg-light me-5'
                        }`} style={{ maxWidth: '70%' }}>
                          <p className="mb-1">{message.content}</p>
                          <small className={`${message.isOwn ? 'text-white-50' : 'text-muted'}`}>
                            {formatTime(message.timestamp)}
                          </small>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="card-footer">
                  <form onSubmit={sendMessage}>
                    <div className="input-group">
                      <button type="button" className="btn btn-outline-secondary">
                        <i className="fas fa-paperclip"></i>
                      </button>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="card h-100 d-flex align-items-center justify-content-center">
                <div className="text-center text-muted">
                  <i className="fas fa-comments fa-4x mb-3"></i>
                  <h4>Select a conversation</h4>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
