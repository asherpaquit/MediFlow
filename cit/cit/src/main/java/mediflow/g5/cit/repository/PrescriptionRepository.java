package mediflow.g5.cit.repository;

import mediflow.g5.cit.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    List<Prescription> findByAppointment_AppointmentId(String appointmentId);
    List<Prescription> findByDoctor_DoctorId(Long doctorId);

}

