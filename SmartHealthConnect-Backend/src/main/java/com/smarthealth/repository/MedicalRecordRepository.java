package com.smarthealth.repository;

import com.smarthealth.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    List<MedicalRecord> findByPatientId(Long patientId);
    
    List<MedicalRecord> findByDoctorId(Long doctorId);
    
    List<MedicalRecord> findByPatientIdAndType(Long patientId, MedicalRecord.RecordType type);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId ORDER BY mr.createdAt DESC")
    List<MedicalRecord> findPatientRecordsOrderByDate(@Param("patientId") Long patientId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId AND mr.createdAt >= :startDate AND mr.createdAt <= :endDate ORDER BY mr.createdAt DESC")
    List<MedicalRecord> findPatientRecordsByDateRange(@Param("patientId") Long patientId, 
                                                     @Param("startDate") LocalDateTime startDate, 
                                                     @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctor.id = :doctorId ORDER BY mr.createdAt DESC")
    List<MedicalRecord> findDoctorRecordsOrderByDate(@Param("doctorId") Long doctorId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId AND mr.isConfidential = false ORDER BY mr.createdAt DESC")
    List<MedicalRecord> findNonConfidentialRecordsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.patient.id = :patientId")
    Long countRecordsByPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(mr) FROM MedicalRecord mr WHERE mr.doctor.id = :doctorId")
    Long countRecordsByDoctor(@Param("doctorId") Long doctorId);
    
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId AND " +
           "(LOWER(mr.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.diagnosis) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.symptoms) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY mr.createdAt DESC")
    List<MedicalRecord> searchPatientRecords(@Param("patientId") Long patientId, @Param("searchTerm") String searchTerm);
}
