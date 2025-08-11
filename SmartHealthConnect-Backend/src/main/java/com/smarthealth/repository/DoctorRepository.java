package com.smarthealth.repository;

import com.smarthealth.entity.Doctor;
import com.smarthealth.entity.Doctor.AvailabilityStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    // Find by email
    Optional<Doctor> findByEmail(String email);
    
    // Find by license number
    Optional<Doctor> findByLicenseNumber(String licenseNumber);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Check if license number exists
    boolean existsByLicenseNumber(String licenseNumber);
    
    // Find by specialization
    List<Doctor> findBySpecializationIgnoreCase(String specialization);
    
    // Find by department
    List<Doctor> findByDepartmentIgnoreCase(String department);
    
    // Find by availability status
    List<Doctor> findByAvailability(AvailabilityStatus availability);
    
    // Find active doctors
    List<Doctor> findByIsActiveTrue();
    
    // Find inactive doctors
    List<Doctor> findByIsActiveFalse();
    
    // Find by active status and availability
    List<Doctor> findByIsActiveTrueAndAvailability(AvailabilityStatus availability);
    
    // Search doctors by name, specialization, or department
    @Query("SELECT d FROM Doctor d WHERE " +
           "(LOWER(d.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.department) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND d.isActive = true")
    Page<Doctor> searchActiveDoctors(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Search all doctors (including inactive)
    @Query("SELECT d FROM Doctor d WHERE " +
           "LOWER(d.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.department) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Doctor> searchAllDoctors(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find doctors by department with pagination
    Page<Doctor> findByDepartmentIgnoreCaseAndIsActiveTrue(String department, Pageable pageable);
    
    // Find doctors by specialization with pagination
    Page<Doctor> findBySpecializationIgnoreCaseAndIsActiveTrue(String specialization, Pageable pageable);
    
    // Find doctors by availability with pagination
    Page<Doctor> findByAvailabilityAndIsActiveTrue(AvailabilityStatus availability, Pageable pageable);
    
    // Get doctors with highest ratings
    @Query("SELECT d FROM Doctor d WHERE d.isActive = true ORDER BY d.rating DESC")
    Page<Doctor> findTopRatedDoctors(Pageable pageable);
    
    // Get doctors with most patients
    @Query("SELECT d FROM Doctor d WHERE d.isActive = true ORDER BY d.totalPatients DESC")
    Page<Doctor> findMostExperiencedDoctors(Pageable pageable);
    
    // Count doctors by department
    @Query("SELECT COUNT(d) FROM Doctor d WHERE LOWER(d.department) = LOWER(:department) AND d.isActive = true")
    Long countByDepartment(@Param("department") String department);
    
    // Count doctors by specialization
    @Query("SELECT COUNT(d) FROM Doctor d WHERE LOWER(d.specialization) = LOWER(:specialization) AND d.isActive = true")
    Long countBySpecialization(@Param("specialization") String specialization);
    
    // Count available doctors
    Long countByAvailabilityAndIsActiveTrue(AvailabilityStatus availability);
    
    // Get all specializations
    @Query("SELECT DISTINCT d.specialization FROM Doctor d WHERE d.isActive = true ORDER BY d.specialization")
    List<String> findAllSpecializations();
    
    // Get all departments
    @Query("SELECT DISTINCT d.department FROM Doctor d WHERE d.isActive = true AND d.department IS NOT NULL ORDER BY d.department")
    List<String> findAllDepartments();
    
    // Find doctors by rating range
    @Query("SELECT d FROM Doctor d WHERE d.rating >= :minRating AND d.rating <= :maxRating AND d.isActive = true")
    List<Doctor> findByRatingBetween(@Param("minRating") Double minRating, @Param("maxRating") Double maxRating);
    
    // Find doctors by consultation fee range
    @Query("SELECT d FROM Doctor d WHERE d.consultationFee >= :minFee AND d.consultationFee <= :maxFee AND d.isActive = true")
    List<Doctor> findByConsultationFeeBetween(@Param("minFee") Double minFee, @Param("maxFee") Double maxFee);
    
    // Advanced search with multiple filters
    @Query("SELECT d FROM Doctor d WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(d.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:department IS NULL OR LOWER(d.department) = LOWER(:department)) AND " +
           "(:specialization IS NULL OR LOWER(d.specialization) = LOWER(:specialization)) AND " +
           "(:availability IS NULL OR d.availability = :availability) AND " +
           "(:isActive IS NULL OR d.isActive = :isActive)")
    Page<Doctor> findWithFilters(
        @Param("searchTerm") String searchTerm,
        @Param("department") String department,
        @Param("specialization") String specialization,
        @Param("availability") AvailabilityStatus availability,
        @Param("isActive") Boolean isActive,
        Pageable pageable
    );
}
