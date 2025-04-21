package mediflow.g5.cit.controller;

import mediflow.g5.cit.entity.UserDoctor;
import mediflow.g5.cit.service.UserDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user-doctors")
public class UserDoctorController {

    @Autowired
    private UserDoctorService userDoctorService;

    @PostMapping("/login")
    public ResponseEntity<?> loginDoctor(@RequestBody UserDoctor loginRequest) {
        try {
            UserDoctor doctor = userDoctorService.authenticate(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            if (doctor != null) {
                return ResponseEntity.ok(doctor);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed");
        }
    }

    @GetMapping
    public ResponseEntity<List<UserDoctor>> getAllDoctors() {
        return ResponseEntity.ok(userDoctorService.getAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDoctor> getDoctorById(@PathVariable String id) {
        Optional<UserDoctor> doctor = userDoctorService.getDoctorById(id);
        return doctor.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserDoctor> createDoctor(@RequestBody UserDoctor userDoctor) {
        UserDoctor savedDoctor = userDoctorService.createDoctor(userDoctor);
        return ResponseEntity.ok(savedDoctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDoctor> updateDoctor(@PathVariable String id, @RequestBody UserDoctor updatedDoctor) {
        UserDoctor doctor = userDoctorService.updateDoctor(id, updatedDoctor);
        return doctor != null ? ResponseEntity.ok(doctor) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        userDoctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}