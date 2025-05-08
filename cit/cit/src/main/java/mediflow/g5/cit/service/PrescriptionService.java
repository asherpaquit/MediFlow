package mediflow.g5.cit.service;

import mediflow.g5.cit.entity.Prescription;
import mediflow.g5.cit.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

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
}
