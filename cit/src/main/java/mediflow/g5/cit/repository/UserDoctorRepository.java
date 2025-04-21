package mediflow.g5.cit.repository;

import mediflow.g5.cit.entity.UserDoctor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDoctorRepository extends JpaRepository<UserDoctor, String> {
    UserDoctor findByUsername(String username);
}
