package mediflow.g5.cit.controller;

import mediflow.g5.cit.entity.UserDoctor;
import mediflow.g5.cit.service.UserDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-doctors")
public class UserDoctorController {

    @Autowired
    private UserDoctorService userDoctorService;

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        List<UserDoctor> doctors = userDoctorService.getAllDoctors();
        List<DoctorResponse> response = doctors.stream()
                .map(doctor -> new DoctorResponse(
                        doctor.getDoctorId(),
                        doctor.getFirstName(),
                        doctor.getLastName(),
                        doctor.getSpecialization(),
                        true // or your availability logic
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    public static class DoctorResponse {
        private Long doctorId;
        private String firstname;
        private String lastname;
        private String specialization;
        private boolean isAvailable;

        // Constructor
        public DoctorResponse(Long doctorId, String firstname, String lastname, String specialization, boolean isAvailable) {
            this.doctorId = doctorId;
            this.firstname = firstname;
            this.lastname = lastname;
            this.specialization = specialization;
            this.isAvailable = isAvailable;
        }

        // Getters (required for JSON serialization)
        public Long getDoctorId() { return doctorId; }
        public String getFirstname() { return firstname; }
        public String getLastname() { return lastname; }
        public String getSpecialization() { return specialization; }
        public boolean getIsAvailable() { return isAvailable; }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginDoctor(@RequestBody LoginRequest loginRequest) {
        try {
            UserDoctor doctor = userDoctorService.authenticate(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            if (doctor != null) {
                return ResponseEntity.ok(doctor);
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    // Other endpoints remain the same, but will now handle the new fields
    @PostMapping
    public ResponseEntity<UserDoctor> createDoctor(@RequestBody UserDoctor userDoctor) {
        UserDoctor savedDoctor = userDoctorService.createDoctor(userDoctor);
        return ResponseEntity.ok(savedDoctor);
    }

    // Add this inner class for login request
    private static class LoginRequest {
        private String username;
        private String password;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}