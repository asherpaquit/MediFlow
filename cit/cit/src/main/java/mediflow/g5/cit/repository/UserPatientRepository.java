package mediflow.g5.cit.repository;

import mediflow.g5.cit.entity.UserPatient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPatientRepository extends JpaRepository<UserPatient, Long> {
    boolean existsByUsername(String username);
    Optional<UserPatient> findByUsernameAndPassword(String username, String password);
}

