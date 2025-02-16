package edu.cit.mediflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.List;

@Entity
//@Document
public class Patient {
    @Id
    private String patientId;
    private String name;
    private String dateOfBirth;
    private String gender;
    private String contactInfo;
    private List<HealthNotification> healthNotifications;
}
