package mediflow.g5.cit.controller;

import mediflow.g5.cit.dto.PrescriptionRequest;
import mediflow.g5.cit.entity.Appointment;
import mediflow.g5.cit.entity.Prescription;
import mediflow.g5.cit.entity.UserDoctor;
import mediflow.g5.cit.entity.UserPatient;
import mediflow.g5.cit.repository.AppointmentRepository;
import mediflow.g5.cit.repository.UserDoctorRepository;
import mediflow.g5.cit.repository.UserPatientRepository;
import mediflow.g5.cit.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;
    @Autowired
    private UserDoctorRepository userDoctorRepository;

    @Autowired
    private UserPatientRepository userPatientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionRequest request) {
        try {
            UserDoctor doctor = userDoctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new IllegalArgumentException("Doctor not found with ID: " + request.getDoctorId()));

            UserPatient patient = userPatientRepository.findById(request.getPatientId())
                    .orElseThrow(() -> new IllegalArgumentException("Patient not found with ID: " + request.getPatientId()));

            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Appointment not found with ID: " + request.getAppointmentId()));

            // Map PrescriptionRequest to Prescription entity
            Prescription prescription = new Prescription();
            prescription.setMedication(request.getMedication());
            prescription.setDosage(request.getDosage());
            prescription.setInstructions(request.getInstructions());
            prescription.setDateIssued(request.getDateIssued());
            prescription.setDoctor(doctor);
            prescription.setPatient(patient);
            prescription.setAppointment(appointment);

            // Use createPrescription instead of savePrescription to ensure medical record is created
            Prescription saved = prescriptionService.createPrescription(prescription);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByAppointment(@PathVariable String appointmentId) {
        return ResponseEntity.ok(prescriptionService.getByAppointmentId(appointmentId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(prescriptionService.getByDoctorId(doctorId));
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable String id) {
        return prescriptionService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable String id) {
        prescriptionService.deletePrescription(id);
        return ResponseEntity.noContent().build();
    }
}
