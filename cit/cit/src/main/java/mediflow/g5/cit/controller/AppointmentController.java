package mediflow.g5.cit.controller;

import mediflow.g5.cit.entity.Appointment;
import mediflow.g5.cit.entity.UserDoctor;
import mediflow.g5.cit.entity.UserPatient;
import mediflow.g5.cit.service.AppointmentService;
import mediflow.g5.cit.service.UserDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserDoctorService userDoctorService; // Inject UserDoctorService

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest appointmentRequest) {
        try {
            // Validate request
            if (appointmentRequest.getDoctorId() == null ||
                    appointmentRequest.getPatientId() == null ||
                    appointmentRequest.getDate() == null ||
                    appointmentRequest.getTime() == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            // Fetch doctor and patient
            UserDoctor doctor = userDoctorService.getDoctorById(appointmentRequest.getDoctorId()).orElse(null);
            UserPatient patient = appointmentService.getPatientById(appointmentRequest.getPatientId()).orElse(null); //Added getPatientById()

            if (doctor == null || patient == null) {
                return ResponseEntity.badRequest().body("Invalid doctor or patient ID");
            }

            // Create appointment
            Appointment appointment = new Appointment();
            appointment.setAppointmentId(UUID.randomUUID().toString()); // Use UUID for IDs
            appointment.setDate(appointmentRequest.getDate());
            appointment.setTime(appointmentRequest.getTime());
            appointment.setStatus("Pending"); // Initial status
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);

            Appointment createdAppointment = appointmentService.createAppointment(appointment);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Appointment updatedAppointment) {
        Appointment appointment = appointmentService.updateAppointment(id, updatedAppointment);
        return appointment != null ? ResponseEntity.ok(appointment) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatientId(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
public ResponseEntity<List<Appointment>> getAppointmentsByDoctorId(@PathVariable Long doctorId) {
    List<Appointment> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
    return ResponseEntity.ok(appointments);
    }   

    // Add this inner class to handle the appointment request data
    private static class AppointmentRequest {
        private Long doctorId;
        private Long patientId;
        private String date;
        private String time;
        private String notes; // Added notes

        public Long getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(Long doctorId) {
            this.doctorId = doctorId;
        }

        public Long getPatientId() {
            return patientId;
        }

        public void setPatientId(Long patientId) {
            this.patientId = patientId;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}

