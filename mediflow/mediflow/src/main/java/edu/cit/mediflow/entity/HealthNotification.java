package edu.cit.mediflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
//@Document
public class HealthNotification {
    @Id
    private String notificationId;
    private String message;
    private String date;
    private String time;
    private String type;

}
