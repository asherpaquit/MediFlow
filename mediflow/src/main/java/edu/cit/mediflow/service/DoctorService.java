package edu.cit.mediflow.service;

import edu.cit.mediflow.entity.Doctor;
import edu.cit.mediflow.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(String doctorId) {
        return doctorRepository.findById(doctorId);
    }

    public void deleteDoctor(String doctorId) {
        doctorRepository.deleteById(doctorId);
    }
}
