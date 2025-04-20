package edu.cit.mediflow.service;

import edu.cit.mediflow.entity.Patient;
import edu.cit.mediflow.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository repository;

    public List<Patient> getAllPatients() {
        return repository.findAll();
    }

    public Optional<Patient> getPatientById(String id) {
        return repository.findById(id);
    }

    public Patient createPatient(Patient patient) {
        return repository.save(patient);
    }

    public Patient updatePatient(String id, Patient updatedPatient) {
        return repository.findById(id).map(existingPatient -> {
            existingPatient.setName(updatedPatient.getName());
            existingPatient.setDateOfBirth(updatedPatient.getDateOfBirth());
            existingPatient.setGender(updatedPatient.getGender());
            existingPatient.setContactInfo(updatedPatient.getContactInfo());
            return repository.save(existingPatient);
        }).orElse(null);
    }

    public void deletePatient(String id) {
        repository.deleteById(id);
    }
}
