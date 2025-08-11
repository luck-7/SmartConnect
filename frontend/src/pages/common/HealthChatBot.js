import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const HealthChatBot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Welcome message
    const welcomeMessage = {
      id: 1,
      sender: 'bot',
      content: `Hello ${user?.firstName || 'there'}! 👋 I'm your Smart Health Assistant. I can help you with:

• Health information and advice
• Symptom guidance
• Medication information
• Wellness tips
• Emergency guidance
• Appointment scheduling

How can I assist you today?`,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(userMessage.content);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    let response = '';

    // Health-related responses
    if (input.includes('headache') || input.includes('head pain')) {
      response = `I understand you're experiencing headaches. Here are some general suggestions:

🔹 **Immediate Relief:**
• Rest in a quiet, dark room
• Apply cold or warm compress
• Stay hydrated
• Gentle neck/shoulder massage

🔹 **When to seek medical attention:**
• Severe, sudden headache
• Headache with fever, stiff neck
• Changes in vision
• Persistent headaches

Would you like me to help you schedule an appointment with a doctor?`;
    }
    else if (input.includes('fever') || input.includes('temperature')) {
      response = `Fever can be concerning. Here's what you should know:

🌡️ **Normal Temperature:** 98.6°F (37°C)
🔥 **Fever:** Above 100.4°F (38°C)

🔹 **Home Care:**
• Rest and stay hydrated
• Take acetaminophen or ibuprofen
• Light clothing and cool environment
• Monitor temperature regularly

🚨 **Seek immediate care if:**
• Temperature above 103°F (39.4°C)
• Difficulty breathing
• Severe dehydration
• Fever lasting more than 3 days

Should I help you find the nearest urgent care?`;
    }
    else if (input.includes('cough') || input.includes('cold')) {
      response = `Coughs can have various causes. Here's some guidance:

🔹 **For Dry Cough:**
• Honey and warm water
• Throat lozenges
• Humidifier or steam inhalation

🔹 **For Productive Cough:**
• Stay hydrated
• Avoid cough suppressants
• Warm salt water gargle

⚠️ **See a doctor if:**
• Cough with blood
• Persistent cough (>3 weeks)
• High fever with cough
• Difficulty breathing

Would you like information about respiratory specialists in your area?`;
    }
    else if (input.includes('stomach') || input.includes('nausea') || input.includes('vomit')) {
      response = `Stomach issues can be uncomfortable. Here's some advice:

🔹 **For Nausea:**
• Sip clear fluids slowly
• Try ginger tea or crackers
• Avoid strong odors
• Rest in upright position

🔹 **For Stomach Pain:**
• Apply heat pad to abdomen
• Avoid solid foods temporarily
• Try BRAT diet (Bananas, Rice, Applesauce, Toast)

🚨 **Seek immediate care for:**
• Severe abdominal pain
• Blood in vomit or stool
• Signs of dehydration
• High fever with stomach pain

Need help finding a gastroenterologist?`;
    }
    else if (input.includes('medication') || input.includes('medicine') || input.includes('drug')) {
      response = `I can provide general medication information:

💊 **Important Reminders:**
• Always follow prescribed dosages
• Take medications as directed
• Don't share prescription medications
• Check expiration dates

🔹 **Common Questions:**
• Drug interactions
• Side effects
• Proper storage
• When to take medications

⚠️ **Always consult your pharmacist or doctor for:**
• Specific medication advice
• Dosage changes
• Side effect concerns
• Drug interactions

Would you like me to help you find pharmacy information or medication reminders?`;
    }
    else if (input.includes('emergency') || input.includes('urgent') || input.includes('911')) {
      response = `🚨 **EMERGENCY SITUATIONS - CALL 911 IMMEDIATELY:**

• Chest pain or heart attack symptoms
• Difficulty breathing or choking
• Severe bleeding
• Loss of consciousness
• Severe allergic reactions
• Stroke symptoms (FAST: Face, Arms, Speech, Time)
• Severe burns or injuries

📞 **Emergency Numbers:**
• Emergency: 911
• Poison Control: 1-800-222-1222
• Crisis Hotline: 988

🏥 **For non-life-threatening urgent care:**
• Urgent care centers
• Walk-in clinics
• Telehealth consultations

Are you experiencing a medical emergency right now?`;
    }
    else if (input.includes('appointment') || input.includes('schedule') || input.includes('book')) {
      response = `I'd be happy to help you with appointment scheduling! 📅

🔹 **Available Options:**
• Primary care physicians
• Specialists (cardiology, dermatology, etc.)
• Mental health professionals
• Preventive care (checkups, screenings)

🔹 **What I need to know:**
• Type of appointment needed
• Preferred date/time
• Any specific doctor preferences
• Insurance information

Would you like me to:
1. Show available doctors
2. Check appointment availability
3. Provide contact information for scheduling

What type of appointment are you looking for?`;
    }
    else if (input.includes('mental health') || input.includes('anxiety') || input.includes('depression') || input.includes('stress')) {
      response = `Mental health is just as important as physical health. 🧠💚

🔹 **Immediate Support:**
• Crisis Text Line: Text HOME to 741741
• National Suicide Prevention Lifeline: 988
• SAMHSA Helpline: 1-800-662-4357

🔹 **Self-Care Tips:**
• Practice deep breathing
• Regular exercise
• Adequate sleep (7-9 hours)
• Connect with supportive people
• Mindfulness and meditation

🔹 **Professional Help:**
• Therapists and counselors
• Psychiatrists for medication
• Support groups
• Employee assistance programs

Remember: Seeking help is a sign of strength, not weakness.

Would you like help finding mental health resources in your area?`;
    }
    else if (input.includes('diet') || input.includes('nutrition') || input.includes('food')) {
      response = `Nutrition plays a vital role in health! 🥗

🔹 **Healthy Eating Tips:**
• Eat variety of colorful fruits/vegetables
• Choose whole grains over refined
• Include lean proteins
• Stay hydrated (8 glasses water/day)
• Limit processed foods and added sugars

🔹 **Special Dietary Needs:**
• Diabetes management
• Heart-healthy diets
• Weight management
• Food allergies/intolerances

🔹 **Meal Planning:**
• Plan meals ahead
• Read nutrition labels
• Control portion sizes
• Cook at home when possible

Would you like specific nutrition advice or help finding a registered dietitian?`;
    }
    else if (input.includes('exercise') || input.includes('fitness') || input.includes('workout')) {
      response = `Exercise is medicine for the body and mind! 💪

🔹 **Recommended Activity:**
• 150 minutes moderate exercise/week
• 2 days strength training
• Daily movement and stretching

🔹 **Types of Exercise:**
• Cardio: walking, swimming, cycling
• Strength: weights, resistance bands
• Flexibility: yoga, stretching
• Balance: tai chi, balance exercises

🔹 **Getting Started:**
• Start slowly and gradually increase
• Choose activities you enjoy
• Set realistic goals
• Listen to your body

⚠️ **Consult doctor before starting if you have:**
• Heart conditions
• Joint problems
• Chronic health conditions

Need help creating a personalized fitness plan?`;
    }
    else if (input.includes('sleep') || input.includes('insomnia') || input.includes('tired')) {
      response = `Good sleep is essential for health! 😴

🔹 **Sleep Hygiene Tips:**
• Consistent sleep schedule
• Cool, dark, quiet bedroom
• Avoid screens 1 hour before bed
• No caffeine late in day
• Regular exercise (not before bed)

🔹 **Recommended Sleep:**
• Adults: 7-9 hours
• Teens: 8-10 hours
• Children: 9-11 hours

🔹 **When to See a Doctor:**
• Chronic insomnia
• Loud snoring
• Daytime fatigue
• Sleep apnea symptoms

🔹 **Natural Sleep Aids:**
• Chamomile tea
• Meditation/relaxation
• Reading before bed
• Warm bath

Would you like tips for better sleep or information about sleep specialists?`;
    }
    else if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      response = `Hello! 👋 I'm here to help with your health questions and concerns. 

I can assist you with:
• Symptom guidance
• Health information
• Appointment scheduling
• Wellness tips
• Emergency guidance

What would you like to know about today?`;
    }
    else if (input.includes('thank') || input.includes('thanks')) {
      response = `You're very welcome! 😊 I'm glad I could help. 

Remember:
• I'm here 24/7 for health questions
• Always consult healthcare professionals for serious concerns
• Your health and wellbeing are important

Is there anything else I can help you with today?`;
    }
    else if (input.includes('help') || input.includes('what can you do')) {
      response = `I'm your Smart Health Assistant! Here's how I can help: 🏥

🔹 **Health Information:**
• Symptom guidance
• General medical advice
• Medication information
• Wellness tips

🔹 **Healthcare Services:**
• Appointment scheduling
• Doctor recommendations
• Emergency guidance
• Health resources

🔹 **Wellness Support:**
• Nutrition advice
• Exercise recommendations
• Mental health resources
• Sleep guidance

🔹 **Emergency Assistance:**
• Emergency contact information
• When to seek immediate care
• First aid guidance

Just ask me anything health-related, and I'll do my best to help!`;
    }
    else {
      // Default response for unrecognized queries
      response = `I understand you're asking about "${userInput}". While I try to help with health-related questions, I might not have specific information about this topic.

🔹 **I can help with:**
• Common symptoms and conditions
• General health advice
• Appointment scheduling
• Emergency guidance
• Wellness tips

🔹 **For specific medical concerns:**
• Consult your healthcare provider
• Call your doctor's office
• Visit urgent care if needed
• Use telehealth services

Would you like me to help you find healthcare resources or answer a different health question?`;
    }

    return {
      id: Date.now() + 1,
      sender: 'bot',
      content: response,
      timestamp: new Date(),
      type: 'text'
    };
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickActions = [
    { text: "Symptom Checker", action: () => setNewMessage("I have symptoms I'd like to check") },
    { text: "Book Appointment", action: () => setNewMessage("I need to schedule an appointment") },
    { text: "Emergency Help", action: () => setNewMessage("I need emergency guidance") },
    { text: "Medication Info", action: () => setNewMessage("I have questions about medication") }
  ];

  return (
    <div className="health-chatbot-container">
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="chatbot-card">
              <div className="chatbot-header">
                <div className="chatbot-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="chatbot-info">
                  <h4 className="chatbot-title">Smart Health Assistant</h4>
                  <p className="chatbot-status">
                    <i className="fas fa-circle online-dot"></i>
                    Online • Ready to help
                  </p>
                </div>
                <div className="chatbot-actions">
                  <button className="btn btn-outline-light btn-sm">
                    <i className="fas fa-phone"></i>
                  </button>
                  <button className="btn btn-outline-light btn-sm">
                    <i className="fas fa-video"></i>
                  </button>
                </div>
              </div>

              <div className="chatbot-messages">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                  >
                    <div className="message-avatar">
                      {message.sender === 'user' ? (
                        <div className="user-avatar">
                          {user?.firstName?.charAt(0) || 'U'}
                        </div>
                      ) : (
                        <div className="bot-avatar">
                          <i className="fas fa-robot"></i>
                        </div>
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        <pre className="message-text">{message.content}</pre>
                        <span className="message-time">{formatTime(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message bot-message">
                    <div className="message-avatar">
                      <div className="bot-avatar">
                        <i className="fas fa-robot"></i>
                      </div>
                    </div>
                    <div className="message-content">
                      <div className="message-bubble typing-indicator">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="quick-actions">
                <div className="quick-actions-title">Quick Actions:</div>
                <div className="quick-actions-buttons">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      className="btn btn-outline-primary btn-sm quick-action-btn"
                      onClick={action.action}
                    >
                      {action.text}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chatbot-input">
                <div className="input-group">
                  <button className="btn btn-outline-secondary">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ask me anything about your health..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button 
                    className="btn btn-primary"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isTyping}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>

              <div className="chatbot-disclaimer">
                <i className="fas fa-info-circle"></i>
                <small>
                  This chatbot provides general health information only. For medical emergencies, call 911. 
                  Always consult healthcare professionals for medical advice.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthChatBot;
