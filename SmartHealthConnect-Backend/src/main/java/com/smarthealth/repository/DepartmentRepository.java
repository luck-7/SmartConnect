package com.smarthealth.repository;

import com.smarthealth.entity.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    
    // Find by name
    Optional<Department> findByNameIgnoreCase(String name);
    
    // Check if name exists
    boolean existsByNameIgnoreCase(String name);
    
    // Find active departments
    List<Department> findByIsActiveTrueOrderByName();
    
    // Find inactive departments
    List<Department> findByIsActiveFalseOrderByName();
    
    // Find all departments ordered by name
    List<Department> findAllByOrderByName();
    
    // Search departments by name or description
    @Query("SELECT d FROM Department d WHERE " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.head) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND d.isActive = true")
    Page<Department> searchActiveDepartments(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Search all departments (including inactive)
    @Query("SELECT d FROM Department d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.head) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Department> searchAllDepartments(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find departments by head
    List<Department> findByHeadIgnoreCaseAndIsActiveTrue(String head);
    
    // Find departments with capacity greater than
    @Query("SELECT d FROM Department d WHERE d.capacity >= :minCapacity AND d.isActive = true ORDER BY d.capacity DESC")
    List<Department> findByCapacityGreaterThanEqual(@Param("minCapacity") Integer minCapacity);
    
    // Find departments by location
    @Query("SELECT d FROM Department d WHERE LOWER(d.location) LIKE LOWER(CONCAT('%', :location, '%')) AND d.isActive = true")
    List<Department> findByLocationContainingIgnoreCase(@Param("location") String location);
    
    // Get departments with most doctors
    @Query("SELECT d FROM Department d WHERE d.isActive = true ORDER BY d.totalDoctors DESC")
    Page<Department> findDepartmentsWithMostDoctors(Pageable pageable);
    
    // Get departments with most patients
    @Query("SELECT d FROM Department d WHERE d.isActive = true ORDER BY d.totalPatients DESC")
    Page<Department> findDepartmentsWithMostPatients(Pageable pageable);
    
    // Count active departments
    Long countByIsActiveTrue();
    
    // Count inactive departments
    Long countByIsActiveFalse();
    
    // Get total capacity of all active departments
    @Query("SELECT SUM(d.capacity) FROM Department d WHERE d.isActive = true")
    Long getTotalCapacity();
    
    // Get total doctors across all departments
    @Query("SELECT SUM(d.totalDoctors) FROM Department d WHERE d.isActive = true")
    Long getTotalDoctorsCount();
    
    // Get total patients across all departments
    @Query("SELECT SUM(d.totalPatients) FROM Department d WHERE d.isActive = true")
    Long getTotalPatientsCount();
    
    // Find departments with available capacity
    @Query("SELECT d FROM Department d WHERE d.totalPatients < d.capacity AND d.isActive = true")
    List<Department> findDepartmentsWithAvailableCapacity();
    
    // Find departments at full capacity
    @Query("SELECT d FROM Department d WHERE d.totalPatients >= d.capacity AND d.isActive = true")
    List<Department> findDepartmentsAtFullCapacity();
    
    // Advanced search with filters
    @Query("SELECT d FROM Department d WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.head) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:isActive IS NULL OR d.isActive = :isActive) AND " +
           "(:minCapacity IS NULL OR d.capacity >= :minCapacity) AND " +
           "(:maxCapacity IS NULL OR d.capacity <= :maxCapacity)")
    Page<Department> findWithFilters(
        @Param("searchTerm") String searchTerm,
        @Param("isActive") Boolean isActive,
        @Param("minCapacity") Integer minCapacity,
        @Param("maxCapacity") Integer maxCapacity,
        Pageable pageable
    );
    
    // Get department statistics
    @Query("SELECT new map(" +
           "COUNT(d) as totalDepartments, " +
           "SUM(d.totalDoctors) as totalDoctors, " +
           "SUM(d.totalPatients) as totalPatients, " +
           "SUM(d.capacity) as totalCapacity, " +
           "AVG(d.totalDoctors) as avgDoctorsPerDepartment, " +
           "AVG(d.totalPatients) as avgPatientsPerDepartment) " +
           "FROM Department d WHERE d.isActive = true")
    Object getDepartmentStatistics();
}
