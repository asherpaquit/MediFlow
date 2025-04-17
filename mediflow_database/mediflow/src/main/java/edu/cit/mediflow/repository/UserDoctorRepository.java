package edu.cit.mediflow.repository;

import edu.cit.mediflow.entity.UserDoctor;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserDoctorRepository extends MongoRepository<UserDoctor, String> {
    UserDoctor findByUsername(String username);
}