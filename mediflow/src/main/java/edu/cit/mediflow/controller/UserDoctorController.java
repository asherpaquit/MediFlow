package edu.cit.mediflow.controller;

import edu.cit.mediflow.entity.UserDoctor;
import edu.cit.mediflow.service.UserDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user-doctors")
public class UserDoctorController {

    @Autowired
    private UserDoctorService userDoctorService;

    @PostMapping
    public ResponseEntity<UserDoctor> registerDoctor(@RequestBody UserDoctor userDoctor) {
        UserDoctor savedDoctor = userDoctorService.registerDoctor(userDoctor);
        return ResponseEntity.ok(savedDoctor);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDoctor> getDoctorById(@PathVariable String id) {
        UserDoctor doctor = userDoctorService.getDoctorById(id);
        return doctor != null ? ResponseEntity.ok(doctor) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<UserDoctor>> getAllDoctors() {
        List<UserDoctor> doctors = userDoctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        userDoctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDoctor> getDoctorByUsername(@PathVariable String username) {
        UserDoctor doctor = userDoctorService.findByUsername(username);
        return doctor != null ? ResponseEntity.ok(doctor) : ResponseEntity.notFound().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDoctor credentials) {
    UserDoctor doctor = userDoctorService.findByUsername(credentials.getUsername());

    if (doctor != null && doctor.getPassword().equals(credentials.getPassword())) {
        return ResponseEntity.ok(doctor);
    } else {
        return ResponseEntity.status(401).body("Invalid username or password");
    }
}
}