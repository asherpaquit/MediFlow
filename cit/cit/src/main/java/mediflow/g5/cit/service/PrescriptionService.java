package mediflow.g5.cit.service;

import mediflow.g5.cit.entity.MedicalRecord;
import mediflow.g5.cit.entity.Prescription;
import mediflow.g5.cit.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalRecordService medicalRecordService;

    public Prescription savePrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(String id) {
        return prescriptionRepository.findById(id);
    }

    public void deletePrescription(String id) {
        prescriptionRepository.deleteById(id);
    }

    public List<Prescription> getByAppointmentId(String appointmentId) {
        return prescriptionRepository.findByAppointment_AppointmentId(appointmentId);
    }

    public List<Prescription> getByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctor_DoctorId(doctorId);
    }

    public Prescription createPrescription(Prescription prescription) {
        Prescription savedPrescription = prescriptionRepository.save(prescription);

        // Create a corresponding medical record
        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setPatient(prescription.getPatient());
        medicalRecord.setDoctor(prescription.getDoctor());
        medicalRecord.setRecordType("Prescription");
        medicalRecord.setDescription("Prescription for " + prescription.getMedication());
        medicalRecord.setDate(new Date());
        medicalRecord.setPrescription(savedPrescription);

        medicalRecordService.createMedicalRecord(medicalRecord);

        return savedPrescription;
    }
}
