package com.smarthealth.repository;

import com.smarthealth.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find appointments by patient ID
    List<Appointment> findByPatientId(Long patientId);

    // Find appointments by doctor ID
    List<Appointment> findByDoctorId(Long doctorId);

    // Find by doctor ID and status
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, Appointment.Status status);

    // Find upcoming appointments by patient
    @Query("SELECT a FROM Appointment a WHERE a.patient.id = :patientId AND a.appointmentDate > :currentDate ORDER BY a.appointmentDate")
    List<Appointment> findUpcomingAppointmentsByPatient(@Param("patientId") Long patientId, @Param("currentDate") LocalDateTime currentDate);

    // Find upcoming appointments by doctor
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate > :currentDate ORDER BY a.appointmentDate")
    List<Appointment> findUpcomingAppointmentsByDoctor(@Param("doctorId") Long doctorId, @Param("currentDate") LocalDateTime currentDate);

    // Find today appointments by doctor
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate")
    List<Appointment> findTodayAppointmentsByDoctor(@Param("doctorId") Long doctorId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Find conflicting appointments - simplified version without INTERVAL
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate BETWEEN :startTime AND :endTime AND a.status NOT IN ('CANCELLED', 'NO_SHOW')")
    List<Appointment> findConflictingAppointments(@Param("doctorId") Long doctorId, @Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    // Count appointments by patient and status (handles null status)
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.patient.id = :patientId AND (:status IS NULL OR a.status = :status)")
    Long countAppointmentsByPatientAndStatus(@Param("patientId") Long patientId, @Param("status") Appointment.Status status);

    // Count appointments by doctor and status (handles null status)
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId AND (:status IS NULL OR a.status = :status)")
    Long countAppointmentsByDoctorAndStatus(@Param("doctorId") Long doctorId, @Param("status") Appointment.Status status);

    // Find doctor appointments by date range
    @Query("SELECT a FROM Appointment a WHERE (:status IS NULL OR a.status = :status) AND a.appointmentDate BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate")
    List<Appointment> findDoctorAppointmentsByDateRange(@Param("status") Appointment.Status status, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}