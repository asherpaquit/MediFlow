package edu.cit.mediflow.repository;

import edu.cit.mediflow.entity.HealthNotification;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HealthNotificationRepository extends MongoRepository<HealthNotification, String> {
}