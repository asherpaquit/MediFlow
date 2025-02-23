package edu.cit.mediflow.controller;

import edu.cit.mediflow.entity.HealthNotification;
import edu.cit.mediflow.service.HealthNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class HealthNotificationController {

    @Autowired
    private HealthNotificationService service;

    @GetMapping
    public List<HealthNotification> getAllNotifications() {
        return service.getAllNotifications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HealthNotification> getNotificationById(@PathVariable String id) {
        Optional<HealthNotification> notification = service.getNotificationById(id);
        return notification.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public HealthNotification createNotification(@RequestBody HealthNotification notification) {
        return service.createNotification(notification);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HealthNotification> updateNotification(@PathVariable String id, @RequestBody HealthNotification updatedNotification) {
        HealthNotification notification = service.updateNotification(id, updatedNotification);
        return notification != null ? ResponseEntity.ok(notification) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String id) {
        service.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}