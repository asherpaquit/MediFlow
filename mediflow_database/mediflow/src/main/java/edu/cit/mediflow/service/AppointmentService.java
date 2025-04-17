package edu.cit.mediflow.service;

import edu.cit.mediflow.entity.Appointment;
import edu.cit.mediflow.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository repository;

    public List<Appointment> getAllAppointments() {
        return repository.findAll();
    }

    public Optional<Appointment> getAppointmentById(String id) {
        return repository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
        return repository.save(appointment);
    }

    public Appointment updateAppointment(String id, Appointment updatedAppointment) {
        return repository.findById(id).map(existingAppointment -> {
            existingAppointment.setDate(updatedAppointment.getDate());
            existingAppointment.setTime(updatedAppointment.getTime());
            existingAppointment.setStatus(updatedAppointment.getStatus());
            existingAppointment.setPatientId(updatedAppointment.getPatientId());
            existingAppointment.setDoctorId(updatedAppointment.getDoctorId());
            return repository.save(existingAppointment);
        }).orElse(null);
    }

    public void deleteAppointment(String id) {
        repository.deleteById(id);
    }
}
