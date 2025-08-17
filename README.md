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

### SmartConnect



<img width="1334" height="549" alt="Screenshot 2025-08-17 113842" src="https://github.com/user-attachments/assets/882d3b6e-8ba1-41f1-a30d-05ead26b442c" />





<img width="1331" height="558" alt="Screenshot 2025-08-17 113758" src="https://github.com/user-attachments/assets/0185e9f1-a90b-4f47-a704-26a7c2504b63" />



<img width="1340" height="689" alt="Screenshot 2025-08-17 113818" src="https://github.com/user-attachments/assets/964f6f6e-eb35-424b-8139-fd52bcc24705" />



### Registration Page



<img width="1345" height="693" alt="Screenshot 2025-08-17 113917" src="https://github.com/user-attachments/assets/e8aaf61d-8490-4930-9c86-3c53e6f72989" />





### Login Page


<img width="1338" height="690" alt="Screenshot 2025-08-17 113934" src="https://github.com/user-attachments/assets/3d77afc0-a94b-47f1-a304-35c97d3f9b06" />







### Patient Dashboard


<img width="1355" height="696" alt="Screenshot 2025-08-17 114113" src="https://github.com/user-attachments/assets/eb259abd-046f-4980-ac65-4a36c49a6078" />

<img width="1304" height="688" alt="Screenshot (1)" src="https://github.com/user-attachments/assets/7fc86b25-9a1a-4afd-a73b-27a28f93bab3" />



<img width="1333" height="675" alt="Screenshot (3)" src="https://github.com/user-attachments/assets/a7303477-59d4-43ee-b5ba-ed73bfce48bb" />



### Doctor Dashboard



<img width="1347" height="677" alt="Screenshot (4)" src="https://github.com/user-attachments/assets/37487e0c-4341-489f-8aae-87714d0b5179" />




<img width="1339" height="692" alt="Screenshot 2025-08-17 114736" src="https://github.com/user-attachments/assets/5d3a953d-a81e-4d40-b8f6-610f78ed9bf2" />



### Admin Panel

<img width="1353" height="697" alt="Screenshot (5)" src="https://github.com/user-attachments/assets/14ad24a2-2b00-407d-bdc4-ec4e8a87cc03" />






### Symptom Checker


<img width="1360" height="691" alt="Screenshot 2025-08-17 114258" src="https://github.com/user-attachments/assets/0f14566c-be9f-4b5d-a18d-f55f2789fdf0" />




<img width="1366" height="656" alt="Screenshot (2)" src="https://github.com/user-attachments/assets/3d108b9e-ab11-4629-843a-1c83d0642381" />





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
