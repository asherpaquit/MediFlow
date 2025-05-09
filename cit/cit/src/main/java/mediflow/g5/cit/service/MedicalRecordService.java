package mediflow.g5.cit.service;

import mediflow.g5.cit.entity.MedicalRecord;
import mediflow.g5.cit.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class MedicalRecordService {
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord) {
        return medicalRecordRepository.save(medicalRecord);
    }

    public List<MedicalRecord> getMedicalRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    public List<MedicalRecord> getMedicalRecordsByDoctorId(Long doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    public MedicalRecord getMedicalRecordByPrescriptionId(Long prescriptionId) {
        return medicalRecordRepository.findByPrescriptionId(prescriptionId);
    }
}
