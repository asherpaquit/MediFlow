package edu.cit.mediflow.service;

import edu.cit.mediflow.entity.HealthNotification;
import edu.cit.mediflow.repository.HealthNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HealthNotificationService {

    @Autowired
    private HealthNotificationRepository repository;

    public List<HealthNotification> getAllNotifications() {
        return repository.findAll();
    }

    public Optional<HealthNotification> getNotificationById(String id) {
        return repository.findById(id);
    }

    public HealthNotification createNotification(HealthNotification notification) {
        return repository.save(notification);
    }

    public HealthNotification updateNotification(String id, HealthNotification updatedNotification) {
        return repository.findById(id).map(existingNotification -> {
            existingNotification.setMessage(updatedNotification.getMessage());
            existingNotification.setDate(updatedNotification.getDate());
            existingNotification.setTime(updatedNotification.getTime());
            existingNotification.setType(updatedNotification.getType());
            return repository.save(existingNotification);
        }).orElse(null);
    }

    public void deleteNotification(String id) {
        repository.deleteById(id);
    }
}
