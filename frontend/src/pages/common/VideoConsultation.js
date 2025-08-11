import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const VideoConsultation = () => {
  const { appointmentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [consultation, setConsultation] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [participants, setParticipants] = useState([]);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  useEffect(() => {
    initializeVideoCall();
    return () => {
      cleanup();
    };
  }, [appointmentId]);

  const initializeVideoCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Initialize WebRTC peer connection
      setupPeerConnection();
      
      // Fetch consultation details
      await fetchConsultationDetails();
      
      setConnectionStatus('connected');
      toast.success('Video call initialized successfully');
    } catch (error) {
      console.error('Error initializing video call:', error);
      toast.error('Failed to access camera/microphone');
      setConnectionStatus('error');
    }
  };

  const setupPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers for production
      ]
    };

    peerConnectionRef.current = new RTCPeerConnection(configuration);
    
    // Add local stream to peer connection
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      });
    }

    // Handle remote stream
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer via signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };
  };

  const fetchConsultationDetails = async () => {
    try {
      // Mock consultation data - replace with actual API call
      const mockConsultation = {
        id: appointmentId,
        roomId: `room_${appointmentId}`,
        patient: {
          id: 1,
          name: 'John Doe',
          age: 35
        },
        doctor: {
          id: 2,
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiology'
        },
        scheduledTime: new Date(),
        status: 'IN_PROGRESS'
      };
      
      setConsultation(mockConsultation);
      setParticipants([
        { id: mockConsultation.patient.id, name: mockConsultation.patient.name, role: 'patient', joined: true },
        { id: mockConsultation.doctor.id, name: mockConsultation.doctor.name, role: 'doctor', joined: true }
      ]);
    } catch (error) {
      console.error('Error fetching consultation:', error);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Replace video track with screen share
      const videoTrack = screenStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
      }
      
      setIsScreenSharing(true);
      
      // Handle screen share end
      videoTrack.onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
      toast.error('Failed to start screen sharing');
    }
  };

  const stopScreenShare = async () => {
    try {
      // Get camera stream back
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      const videoTrack = cameraStream.getVideoTracks()[0];
      const sender = peerConnectionRef.current.getSenders().find(s => 
        s.track && s.track.kind === 'video'
      );
      
      if (sender) {
        await sender.replaceTrack(videoTrack);
      }
      
      localStreamRef.current = cameraStream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = cameraStream;
      }
      
      setIsScreenSharing(false);
    } catch (error) {
      console.error('Error stopping screen share:', error);
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user.firstName + ' ' + user.lastName,
        content: newMessage,
        timestamp: new Date(),
        senderId: user.id
      };
      
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Send message via WebSocket or signaling server
      console.log('Sending message:', message);
    }
  };

  const endCall = () => {
    cleanup();
    navigate('/dashboard');
    toast.info('Video consultation ended');
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const saveConsultationNotes = () => {
    // Save notes to backend
    console.log('Saving notes:', consultationNotes);
    toast.success('Notes saved successfully');
  };

  if (!consultation) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading consultation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="video-consultation-page bg-dark text-white" style={{ height: '100vh' }}>
      <div className="container-fluid h-100">
        <div className="row h-100">
          {/* Main Video Area */}
          <div className="col-lg-9 d-flex flex-column">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
              <div>
                <h5 className="mb-0">Video Consultation</h5>
                <small className="text-muted">
                  Room: {consultation.roomId} | Status: {connectionStatus}
                </small>
              </div>
              <div className="d-flex align-items-center gap-3">
                {isRecording && (
                  <span className="badge bg-danger">
                    <i className="fas fa-circle me-1"></i>
                    Recording
                  </span>
                )}
                <span className="text-success">
                  <i className="fas fa-circle me-1"></i>
                  {participants.filter(p => p.joined).length} participants
                </span>
              </div>
            </div>

            {/* Video Grid */}
            <div className="flex-grow-1 p-3">
              <div className="row h-100">
                {/* Remote Video */}
                <div className="col-12 mb-3">
                  <div className="position-relative h-100 bg-secondary rounded">
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-100 h-100 rounded"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="position-absolute bottom-0 start-0 p-2">
                      <span className="badge bg-primary">
                        {user.role === 'PATIENT' ? consultation.doctor.name : consultation.patient.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="position-fixed" style={{ bottom: '100px', right: '20px', width: '200px', height: '150px', zIndex: 1000 }}>
              <div className="position-relative h-100 bg-secondary rounded">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-100 h-100 rounded"
                  style={{ objectFit: 'cover' }}
                />
                <div className="position-absolute bottom-0 start-0 p-1">
                  <span className="badge bg-success" style={{ fontSize: '0.7em' }}>
                    You
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-3 border-top border-secondary">
              <div className="d-flex justify-content-center gap-3">
                <button
                  className={`btn ${isAudioEnabled ? 'btn-success' : 'btn-danger'} rounded-circle`}
                  onClick={toggleAudio}
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className={`fas ${isAudioEnabled ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
                </button>
                
                <button
                  className={`btn ${isVideoEnabled ? 'btn-success' : 'btn-danger'} rounded-circle`}
                  onClick={toggleVideo}
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className={`fas ${isVideoEnabled ? 'fa-video' : 'fa-video-slash'}`}></i>
                </button>
                
                <button
                  className={`btn ${isScreenSharing ? 'btn-warning' : 'btn-outline-light'} rounded-circle`}
                  onClick={isScreenSharing ? stopScreenShare : startScreenShare}
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className="fas fa-desktop"></i>
                </button>
                
                <button
                  className="btn btn-outline-light rounded-circle"
                  onClick={() => setIsRecording(!isRecording)}
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className="fas fa-record-vinyl"></i>
                </button>
                
                <button
                  className="btn btn-danger rounded-circle"
                  onClick={endCall}
                  style={{ width: '50px', height: '50px' }}
                >
                  <i className="fas fa-phone-slash"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-3 border-start border-secondary d-flex flex-column">
            {/* Participants */}
            <div className="p-3 border-bottom border-secondary">
              <h6 className="mb-3">Participants ({participants.length})</h6>
              {participants.map(participant => (
                <div key={participant.id} className="d-flex align-items-center mb-2">
                  <div className="me-2">
                    <i className={`fas fa-circle text-${participant.joined ? 'success' : 'secondary'}`} style={{ fontSize: '0.5em' }}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="small">{participant.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.7em' }}>
                      {participant.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat */}
            <div className="flex-grow-1 d-flex flex-column">
              <div className="p-3 border-bottom border-secondary">
                <h6 className="mb-0">Chat</h6>
              </div>
              
              <div className="flex-grow-1 p-3 overflow-auto" style={{ maxHeight: '300px' }}>
                {chatMessages.map(message => (
                  <div key={message.id} className="mb-2">
                    <div className="small text-muted">{message.sender}</div>
                    <div className="bg-secondary p-2 rounded small">
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 border-top border-secondary">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  />
                  <button className="btn btn-primary btn-sm" onClick={sendChatMessage}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Notes (for doctors) */}
            {user.role === 'DOCTOR' && (
              <div className="p-3 border-top border-secondary">
                <h6 className="mb-2">Consultation Notes</h6>
                <textarea
                  className="form-control form-control-sm mb-2"
                  rows="3"
                  placeholder="Add consultation notes..."
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                ></textarea>
                <button className="btn btn-success btn-sm w-100" onClick={saveConsultationNotes}>
                  Save Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;
