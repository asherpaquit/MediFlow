package mediflow.g5.cit.repository;

import mediflow.g5.cit.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {

    // Option 1: Using property path with correct type (Long)
    List<Appointment> findByPatientPatientId(Long patientId);

    // Option 2: Using explicit JPQL query
    @Query("SELECT a FROM Appointment a WHERE a.patient.patientId = :patientId")
    List<Appointment> findByPatientId(@Param("patientId") Long patientId);
}