package edu.cit.mediflow.entity;

import jakarta.persistence.Entity;

@Entity
//@Document
public class Doctor {
    private String doctorId;
    private String name;
    private String specialization;
    private String contactInfo;
}
