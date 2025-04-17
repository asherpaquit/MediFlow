package edu.cit.mediflow.repository;

import edu.cit.mediflow.entity.UserPatient;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserPatientRepository extends MongoRepository<UserPatient, String> {
    boolean existsByUsername(String username);
    Optional<UserPatient> findByUsernameAndPassword(String username, String password);
}
