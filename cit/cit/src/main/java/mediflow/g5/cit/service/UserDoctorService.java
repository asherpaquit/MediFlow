package mediflow.g5.cit.service;

import mediflow.g5.cit.entity.UserDoctor;
import mediflow.g5.cit.repository.UserDoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserDoctorService {

    @Autowired
    private UserDoctorRepository userDoctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDoctor> getAllDoctors() {
        return userDoctorRepository.findAll();
    }

    public Optional<UserDoctor> getDoctorById(Long id) {
        return userDoctorRepository.findById(Long.valueOf(id.toString()));
    }

    public UserDoctor authenticate(String username, String password) {
        UserDoctor doctor = userDoctorRepository.findByUsername(username);
        if (doctor != null && passwordEncoder.matches(password, doctor.getPassword())) {
            return doctor;
        }
        return null;
    }

    public UserDoctor createDoctor(UserDoctor userDoctor) {
        userDoctor.setPassword(passwordEncoder.encode(userDoctor.getPassword()));
        return userDoctorRepository.save(userDoctor);
    }

    public UserDoctor updateDoctor(Long id, UserDoctor updatedDoctor) {
        return userDoctorRepository.findById(Long.valueOf(id.toString()))
                .map(existingDoctor -> {
                    if (updatedDoctor.getPassword() != null && !updatedDoctor.getPassword().isEmpty()) {
                        existingDoctor.setPassword(passwordEncoder.encode(updatedDoctor.getPassword()));
                    }
                    existingDoctor.setFirstName(updatedDoctor.getFirstName());
                    existingDoctor.setLastName(updatedDoctor.getLastName());
                    existingDoctor.setEmail(updatedDoctor.getEmail());
                    existingDoctor.setContactNumber(updatedDoctor.getContactNumber());
                    // Update other fields as needed
                    return userDoctorRepository.save(existingDoctor);
                })
                .orElse(null);
    }

    public void deleteDoctor(Long id) {
        userDoctorRepository.deleteById(Long.valueOf(id.toString()));
    }

    public List<UserDoctor> getAvailableDoctors() {
        return userDoctorRepository.findByIsAvailable(true);
    }
    
}