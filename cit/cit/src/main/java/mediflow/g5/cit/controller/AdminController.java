package mediflow.g5.cit.controller;

import mediflow.g5.cit.dto.AdminLoginRequest;
import mediflow.g5.cit.dto.AdminSignupRequest;
import mediflow.g5.cit.entity.Admin;
import mediflow.g5.cit.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerAdmin(@RequestBody AdminSignupRequest request) {
        try {
            Admin admin = adminService.registerAdmin(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword()
            );
            return ResponseEntity.ok("Admin registered successfully with ID: " + admin.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateAdmin(@RequestBody AdminLoginRequest request) {
        System.out.println("Request received: " + request); // Add logging
        try {
            Admin admin = adminService.authenticateAdmin(request.getUsername(), request.getPassword());
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Admin authenticated successfully");
            response.put("admin", admin);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
