# 🏥 SmartConnect - Healthcare Platform

A comprehensive digital healthcare platform built with React.js and Spring Boot, offering secure medical record management, real-time communication, and AI-powered symptom checking for modern healthcare delivery.


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

## 📸 Screenshots

### Patient Dashboard


### Doctor Dashboard


### Admin Panel


### Symptom Checker


## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/luck-7/SmartConnect.git
cd SmartConnect

# Setup Backend
cd SmartHealthConnect-Backend
mvn clean install
mvn spring-boot:run &

# Setup Frontend (in new terminal)
cd ../frontend
npm install
npm start

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- PostgreSQL 12+
- Maven 3.6+

### Backend Setup
```bash
cd SmartHealthConnect-Backend
mvn clean install
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will start on `http://localhost:3000`

### Database Setup
1. Create PostgreSQL database: `smart_healthconnect`
2. Update `SmartHealthConnect-Backend/src/main/resources/application.properties` with your database credentials:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/smart_healthconnect
 
   ```
3. Run the application - tables will be created automatically using JPA

## 📁 Project Structure

```
SmartConnect/
├── SmartHealthConnect-Backend/  # Spring Boot application
│   ├── src/main/java/
│   │   └── com/smarthealth/
│   │       ├── config/          # Security, WebSocket config
│   │       ├── controller/      # REST endpoints
│   │       ├── entity/          # JPA entities
│   │       ├── repository/      # Data access layer
│   │       ├── security/        # JWT & Authentication
│   │       └── service/         # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── pom.xml
│   └── database-fix.sql
├── frontend/                    # React.js application
│   ├── public/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── common/          # Navbar, shared components
│   │   │   └── DashboardRouter.js
│   │   ├── pages/               # Page components
│   │   │   ├── admin/           # Admin dashboard pages
│   │   │   ├── auth/            # Login/Register pages
│   │   │   ├── common/          # Chat, Video consultation
│   │   │   ├── doctor/          # Doctor dashboard
│   │   │   └── patient/         # Patient dashboard
│   │   ├── services/            # API services
│   │   ├── context/             # React context (Auth)
│   │   └── styles/              # CSS files
│   ├── package.json
│   └── package-lock.json
├── .gitignore
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

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080/ws
```

### Application Properties
Update `SmartHealthConnect-Backend/src/main/resources/application.properties`:
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/smart_healthconnect


# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
app.jwtSecret=smartHealthConnectSecretKey
app.jwtExpirationMs=86400000

# Server Configuration
server.port=8080
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment

### Medical Records
- `GET /api/medical-records` - Get patient records
- `POST /api/medical-records` - Add new record

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/appointments` - Get all appointments
- `GET /api/admin/dashboard` - Get dashboard statistics

## 🧪 Testing

### Backend Testing
```bash
cd SmartHealthConnect-Backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```




## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog
- **v1.0.0** - Initial release with core healthcare features
- Patient, Doctor, and Admin dashboards
- JWT authentication and authorization
- Real-time chat and video consultation
- Appointment booking system
- Medical records management

## 🐛 Known Issues
- Video consultation requires HTTPS in production
- Real-time notifications need WebSocket connection
- Mobile responsiveness needs improvement on some pages

## 📞 Support
For support and questions:
- Create an issue on GitHub
- Email: support@smartconnect.com

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- React.js community for excellent documentation
- Spring Boot team for the robust framework
- Bootstrap for responsive UI components
- Chart.js for data visualization
