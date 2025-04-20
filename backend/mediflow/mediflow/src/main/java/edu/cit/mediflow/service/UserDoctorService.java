package edu.cit.mediflow.service;

import edu.cit.mediflow.entity.UserDoctor;
import edu.cit.mediflow.repository.UserDoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserDoctorService {

    @Autowired
    private UserDoctorRepository userDoctorRepository;

    public List<UserDoctor> getAllDoctors() {
        return userDoctorRepository.findAll();
    }

    public Optional<UserDoctor> getDoctorById(String id) {
        return userDoctorRepository.findById(id);
    }

    public Optional<UserDoctor> getDoctorByUsername(String username) {
        return userDoctorRepository.findByUsername(username);
    }

    public UserDoctor createDoctor(UserDoctor userDoctor) {
        return userDoctorRepository.save(userDoctor);
    }

    public UserDoctor updateDoctor(String id, UserDoctor updatedDoctor) {
        if (userDoctorRepository.existsById(id)) {
            updatedDoctor.setId(id);
            return userDoctorRepository.save(updatedDoctor);
        }
        return null;
    }

    public void deleteDoctor(String id) {
        userDoctorRepository.deleteById(id);
    }
}