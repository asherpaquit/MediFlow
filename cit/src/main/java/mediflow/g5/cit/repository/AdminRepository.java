package mediflow.g5.cit.repository;

import mediflow.g5.cit.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByUsername(String username);
    Optional<Admin> findByUsername(String username);
}

