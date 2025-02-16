package edu.cit.mediflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Appointment {
    @Id
    private String appointmentId;
    private String date;
    private String time;
    private String status;
    private String patientId;
    private String doctorId;
}
