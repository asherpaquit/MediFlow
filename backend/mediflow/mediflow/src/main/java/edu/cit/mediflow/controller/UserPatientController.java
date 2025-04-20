package edu.cit.mediflow.controller;

import edu.cit.mediflow.entity.UserPatient;
import edu.cit.mediflow.service.UserPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user-patients")
public class UserPatientController {

    @Autowired
    private UserPatientService userPatientService;

    @GetMapping
    public ResponseEntity<List<UserPatient>> getAllUserPatients() {
        return ResponseEntity.ok(userPatientService.getAllUserPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserPatient> getUserPatientById(@PathVariable String id) {
        Optional<UserPatient> userPatient = userPatientService.getUserPatientById(id);
        return userPatient.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UserPatient> createUserPatient(@RequestBody UserPatient userPatient) {
    UserPatient savedUserPatient = userPatientService.createUserPatient(userPatient);
    return ResponseEntity.ok(savedUserPatient);
}

    @PutMapping("/{id}")
    public ResponseEntity<UserPatient> updateUserPatient(@PathVariable String id, @RequestBody UserPatient userPatient) {
        UserPatient updated = userPatientService.updateUserPatient(id, userPatient);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/login")
public ResponseEntity<UserPatient> login(@RequestBody Map<String, String> credentials) {
    String username = credentials.get("username");
    String password = credentials.get("password");

    Optional<UserPatient> user = userPatientService.getUserPatientByUsername(username);
    if (user.isPresent() && user.get().getPassword().equals(password)) {
        return ResponseEntity.ok(user.get());
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserPatient(@PathVariable String id) {
        userPatientService.deleteUserPatient(id);
        return ResponseEntity.noContent().build();
    }
}
