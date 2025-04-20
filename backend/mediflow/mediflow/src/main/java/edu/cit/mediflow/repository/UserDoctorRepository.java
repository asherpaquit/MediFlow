package edu.cit.mediflow.repository;

import edu.cit.mediflow.entity.UserDoctor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserDoctorRepository extends MongoRepository<UserDoctor, String> {
    Optional<UserDoctor> findByUsername(String username);
    boolean existsByUsername(String username);
}