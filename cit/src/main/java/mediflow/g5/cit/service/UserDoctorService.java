package mediflow.g5.cit.service;

import mediflow.g5.cit.entity.UserDoctor;
import mediflow.g5.cit.repository.UserDoctorRepository;
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

    public UserDoctor authenticate(String username, String password) {
        UserDoctor doctor = userDoctorRepository.findByUsername(username);
        if (doctor != null && doctor.getPassword().equals(password)) {
            return doctor;
        }
        return null;
    }

    public UserDoctor createDoctor(UserDoctor userDoctor) {
        return userDoctorRepository.save(userDoctor);
    }

    public UserDoctor updateDoctor(String id, UserDoctor updatedDoctor) {
        if (userDoctorRepository.existsById(id)) {
            updatedDoctor.setId(Long.valueOf(id));
            return userDoctorRepository.save(updatedDoctor);
        }
        return null;
    }

    public void deleteDoctor(String id) {
        userDoctorRepository.deleteById(id);
    }

}