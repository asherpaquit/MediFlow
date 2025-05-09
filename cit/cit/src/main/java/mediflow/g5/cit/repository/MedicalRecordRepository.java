package mediflow.g5.cit.repository;

import mediflow.g5.cit.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient.id = :patientId")
    List<MedicalRecord> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.doctor.id = :doctorId")
    List<MedicalRecord> findByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.prescription.id = :prescriptionId")
    MedicalRecord findByPrescriptionId(@Param("prescriptionId") Long prescriptionId);
}