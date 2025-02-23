package edu.cit.mediflow.repository;

import edu.cit.mediflow.entity.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PatientRepository extends MongoRepository<Patient, String> {}