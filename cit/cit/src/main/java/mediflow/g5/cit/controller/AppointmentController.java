package mediflow.g5.cit.controller;

import mediflow.g5.cit.dto.AppointmentRequest;
import mediflow.g5.cit.entity.Appointment;
import mediflow.g5.cit.entity.UserDoctor;
import mediflow.g5.cit.entity.UserPatient;
import mediflow.g5.cit.service.AppointmentService;
import mediflow.g5.cit.service.UserDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private UserDoctorService userDoctorService;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorId(@PathVariable Long doctorId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorAndStatus(
            @PathVariable Long doctorId,
            @PathVariable String status) {

        List<Appointment> appointments = appointmentService.getAppointmentsByDoctorIdAndStatus(doctorId, status);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatientId(@PathVariable Long patientId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest appointmentRequest) {
        try {
            if (appointmentRequest.getDoctorId() == null ||
                    appointmentRequest.getPatientId() == null ||
                    appointmentRequest.getDate() == null ||
                    appointmentRequest.getTime() == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            Optional<UserDoctor> doctorOpt = userDoctorService.getDoctorById(appointmentRequest.getDoctorId());
            Optional<UserPatient> patientOpt = appointmentService.getPatientById(appointmentRequest.getPatientId());

            if (doctorOpt.isEmpty() || patientOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid doctor or patient ID");
            }

            Appointment appointment = new Appointment();
            appointment.setAppointmentId(String.valueOf(Long.valueOf(UUID.randomUUID().toString())));
            appointment.setDoctor(doctorOpt.get());
            appointment.setPatient(patientOpt.get());
            appointment.setDate(appointmentRequest.getDate());
            appointment.setTime(appointmentRequest.getTime());
            appointment.setStatus("Pending");

            return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createAppointment(appointment));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Appointment appointment) {
        Appointment updated = appointmentService.updateAppointment(id, appointment);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        if (newStatus == null || !(newStatus.equals("Confirmed") || newStatus.equals("Cancelled"))) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Appointment> updated = appointmentService.updateAppointmentStatus(id, newStatus);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}