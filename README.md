# 🏥 Smart HealthConnect

A comprehensive digital healthcare platform offering secure medical record management, real-time communication, and AI-powered symptom checking.

## 🎯 Features

### 👨‍⚕ Patient Portal
- Register, login, and manage personal health profile
- Book, reschedule, or cancel appointments online
- View prescriptions, lab reports, diagnoses, and follow-up instructions
- AI Symptom Checker for preliminary triage
- Live Chat with assigned doctor
- Secure video consultations
- Automated reminders via email/SMS
- Download emergency health card
- Interactive health charts and trends

### 🩺 Doctor Dashboard
- View and manage appointments
- Access full patient history and records
- Upload prescriptions and treatment plans
- Real-time chat with patients
- Conduct secure video consultations
- Monitor patient progress with analytics

### 🧑‍💼 Admin Panel
- Manage users, departments, and schedules
- Access system logs and activity stats
- Assign patients to doctors
- Handle escalations and feedback
- Monitor AI recommendations and usage reports

## 🤖 AI-Powered Features
- Symptom checker with department routing
- Smart doctor-patient matching
- Health risk assessment
- Preliminary triage recommendations

## 🔐 Security & Compliance
- JWT-based authentication with Spring Security
- Role-based access control
- Audit logging for sensitive actions
- 2FA for doctors and admins
- GDPR/HIPAA-ready data policies
- Encrypted communication and storage

## 🧱 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js, Bootstrap, SockJS |
| Backend | Spring Boot, WebSocket (STOMP), JWT |
| Database | PostgreSQL |
| Real-time | WebSocket (Spring STOMP + SockJS) |
| AI Triage | Rule-based Java service |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- PostgreSQL 12+
- Maven 3.6+

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Database Setup
1. Create PostgreSQL database: `smart_healthconnect`
2. Update `application.properties` with your database credentials
3. Run the application - tables will be created automatically

## 📁 Project Structure

```
smart-healthconnect/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/healthconnect/
│   │       ├── config/      # Security, WebSocket config
│   │       ├── controller/  # REST endpoints
│   │       ├── entity/      # JPA entities
│   │       ├── repository/  # Data access layer
│   │       ├── service/     # Business logic
│   │       └── dto/         # Data transfer objects
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/
│   └── pom.xml
├── frontend/                # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS files
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## 🔄 Consultation Communication Protocol (CCP)

1. **Patient Assignment**: Patients are assigned doctors automatically or manually
2. **Private Channels**: Secure chat channels created via WebSocket
3. **Follow-up Tracking**: Sessions and escalations are tracked and time-bound
4. **Smart Routing**: AI suggests best-matched doctors based on symptoms

## 📱 Mobile Support
- Progressive Web App (PWA) capabilities
- Responsive design for all screen sizes
- Offline functionality for critical features

## 🌐 API Documentation
Once running, access API documentation at: `http://localhost:8080/swagger-ui.html`

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License.
