package edu.cit.mediflow.controller;

import edu.cit.mediflow.entity.UserDoctor;
import edu.cit.mediflow.service.UserDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
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