package mediflow.g5.cit.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class Appointment {
    @Id
    private String appointmentId;
    private String date;
    private String time;
    private String status;

    @ManyToOne
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private UserPatient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", referencedColumnName = "doctor_id")
    private UserDoctor doctor;


    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

}