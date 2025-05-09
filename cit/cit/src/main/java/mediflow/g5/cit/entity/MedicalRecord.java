package mediflow.g5.cit.entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private UserPatient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private UserDoctor doctor;

    private String recordType;
    private String description;
    private Date date;

    @OneToOne
    @JoinColumn(name = "prescription_id")
    private Prescription prescription;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserPatient getPatient() {
        return patient;
    }

    public void setPatient(UserPatient patient) {
        this.patient = patient;
    }

    public UserDoctor getDoctor() {
        return doctor;
    }

    public void setDoctor(UserDoctor doctor) {
        this.doctor = doctor;
    }

    public String getRecordType() {
        return recordType;
    }

    public void setRecordType(String recordType) {
        this.recordType = recordType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Prescription getPrescription() {
        return prescription;
    }

    public void setPrescription(Prescription prescription) {
        this.prescription = prescription;
    }
}

