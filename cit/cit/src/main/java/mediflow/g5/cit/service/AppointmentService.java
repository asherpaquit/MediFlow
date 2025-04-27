package mediflow.g5.cit.service;

import mediflow.g5.cit.entity.Appointment;
import mediflow.g5.cit.entity.UserPatient; // Import UserPatient
import mediflow.g5.cit.repository.AppointmentRepository;
import mediflow.g5.cit.repository.UserPatientRepository; // Import UserPatientRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserPatientRepository userPatientRepository; // Add this

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientPatientId(patientId);
    }

    // Get patient by ID - added
    public Optional<UserPatient> getPatientById(Long patientId) {
        return userPatientRepository.findById(patientId);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(String id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(String id, Appointment updatedAppointment) {
        return appointmentRepository.findById(id).map(existingAppointment -> {
            existingAppointment.setDate(updatedAppointment.getDate());
            existingAppointment.setTime(updatedAppointment.getTime());
            existingAppointment.setStatus(updatedAppointment.getStatus());
            existingAppointment.setPatient(updatedAppointment.getPatient());
            existingAppointment.setDoctor(updatedAppointment.getDoctor());
            return appointmentRepository.save(existingAppointment);
        }).orElse(null);
    }

    public void deleteAppointment(String id) {
        appointmentRepository.deleteById(id);
    }
}
