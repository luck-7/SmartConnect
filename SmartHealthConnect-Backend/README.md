# Smart HealthConnect Backend

A comprehensive digital healthcare platform backend built with Spring Boot.

## Features

- **JWT Authentication**: Secure user authentication and authorization
- **User Management**: Patient, Doctor, and Admin role management
- **RESTful APIs**: Well-structured REST endpoints
- **PostgreSQL Integration**: Robust database support
- **Security**: Spring Security with CORS configuration
- **Symptom Checker**: Basic symptom checking functionality

## Technology Stack

- **Java 21**
- **Spring Boot 3.2.0**
- **Spring Security**
- **Spring Data JPA**
- **PostgreSQL**
- **JWT (JSON Web Tokens)**
- **Maven**

## Prerequisites

- Java 21 or higher
- PostgreSQL database
- Maven (or use included Maven wrapper)

## Database Setup

1. Install PostgreSQL
2. Create a database named `smart_healthconnect`
3. Update database credentials in `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/smart_healthconnect
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## Running the Application

### Option 1: Using Maven Wrapper (Recommended)
```bash
./mvnw spring-boot:run
```

### Option 2: Using Maven
```bash
mvn spring-boot:run
```

### Option 3: Using Spring Tool Suite
1. Import as existing Maven project
2. Right-click project → Run As → Spring Boot App

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/test` - Test endpoint

### Symptom Checker
- `GET /api/symptom-checker/common-symptoms` - Get common symptoms
- `POST /api/symptom-checker/check` - Check symptoms

## Default Configuration

- **Server Port**: 8080
- **Context Path**: /api
- **Database**: PostgreSQL on localhost:5432
- **JWT Expiration**: 24 hours

## Project Structure

```
src/
├── main/
│   ├── java/com/smarthealth/
│   │   ├── SmartHealthConnectApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── SymptomCheckerController.java
│   │   ├── entity/
│   │   │   └── User.java
│   │   ├── repository/
│   │   │   └── UserRepository.java
│   │   ├── security/
│   │   │   ├── AuthEntryPointJwt.java
│   │   │   ├── AuthTokenFilter.java
│   │   │   └── JwtUtils.java
│   │   └── service/
│   │       └── UserDetailsServiceImpl.java
│   └── resources/
│       └── application.properties
└── test/
    └── java/
```

## Security Features

- JWT-based authentication
- Password encryption using BCrypt
- CORS configuration for frontend integration
- Role-based access control (PATIENT, DOCTOR, ADMIN)

## Development

This project is configured for Spring Tool Suite (STS) and includes:
- Eclipse project files (.project, .classpath)
- Maven wrapper for consistent builds
- Spring Boot DevTools for hot reloading
- Comprehensive logging configuration

## License

This project is for educational and development purposes.
