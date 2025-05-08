package mediflow.g5.cit.repository;

import mediflow.g5.cit.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByDoctorDoctorId(Long doctorId);
    List<Appointment> findByPatientPatientId(Long patientId);
    List<Appointment> findByDoctorDoctorIdAndStatus(Long doctorId, String status);
}