// AdminService.java (Service)
package mediflow.g5.cit.service;

import mediflow.g5.cit.entity.Admin;
import mediflow.g5.cit.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Admin registerAdmin(String username, String email, String password) {
        if (adminRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setEmail(email);
        admin.setPassword(password); // Normally you'd hash this
        return adminRepository.save(admin);
    }

    public Admin authenticateAdmin(String username, String password) {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (!admin.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return admin;
    }
}
