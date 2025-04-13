package edu.cit.mediflow.service;

import edu.cit.mediflow.entity.UserPatient;
import edu.cit.mediflow.repository.UserPatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserPatientService {

    @Autowired
    private UserPatientRepository userPatientRepository;

    public List<UserPatient> getAllUserPatients() {
        return userPatientRepository.findAll();
    }

    public Optional<UserPatient> getUserPatientById(String id) {
        return userPatientRepository.findById(id);
    }

    public UserPatient createUserPatient(UserPatient userPatient) {
        return userPatientRepository.save(userPatient);
    }

    public UserPatient updateUserPatient(String id, UserPatient updatedUserPatient) {
        if (userPatientRepository.existsById(id)) {
            updatedUserPatient.setId(id);
            return userPatientRepository.save(updatedUserPatient);
        }
        return null;
    }

    public void deleteUserPatient(String id) {
        userPatientRepository.deleteById(id);
    }

    public Optional<UserPatient> authenticate(String username, String password) {
        return userPatientRepository.findByUsernameAndPassword(username, password);
    }
}
