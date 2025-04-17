package edu.cit.mediflow.service;

import edu.cit.mediflow.entity.UserDoctor;
import edu.cit.mediflow.repository.UserDoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDoctorService {

    @Autowired
    private UserDoctorRepository userDoctorRepository;

    public UserDoctor registerDoctor(UserDoctor userDoctor) {
        return userDoctorRepository.save(userDoctor);
    }

    public UserDoctor findByUsername(String username) {
        return userDoctorRepository.findByUsername(username);
    }

    public List<UserDoctor> getAllDoctors() {
        return userDoctorRepository.findAll();
    }

    public UserDoctor getDoctorById(String id) {
        return userDoctorRepository.findById(id).orElse(null);
    }

    public void deleteDoctor(String id) {
        userDoctorRepository.deleteById(id);
    }
}