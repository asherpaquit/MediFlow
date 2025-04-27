package mediflow.g5.cit.repository;

import mediflow.g5.cit.entity.UserDoctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDoctorRepository extends JpaRepository<UserDoctor, Long> {
    UserDoctor findByUsername(String username);
    UserDoctor findByEmail(String email);
    List<UserDoctor> findByIsAvailable(boolean isAvailable);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}