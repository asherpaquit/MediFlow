package edu.cit.mediflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.lang.annotation.Documented;

@Entity
//@Document
public class Prescription {
    @Id
    private String prescriptionId;
    private String medication;
    private String dosage;
    private String instructions;
    private String dateIssued;
    private String patientId;
    private String doctorId;
}
