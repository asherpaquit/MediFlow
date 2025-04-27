package mediflow.g5.cit.controller;


import mediflow.g5.cit.entity.UserPatient;
import mediflow.g5.cit.service.UserPatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;



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
        return ResponseEntity.ok(userPatientService.createUserPatient(userPatient));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserPatient(@PathVariable String id) {
        userPatientService.deleteUserPatient(id);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserPatient credentials) {
        Optional<UserPatient> user = userPatientService.authenticate(credentials.getUsername(), credentials.getPassword());

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}