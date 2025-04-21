package mediflow.g5.cit.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_doctor")
public class UserDoctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String medicalLicenseNumber;
    private String specialization;
    private int yearsOfExperience;
    private String affiliatedHospitalStatus;
    private double consultationFee;
    private double baseSalary;

    // Constructors
    public UserDoctor() {
    }

    public UserDoctor(Long id, String username, String password, String medicalLicenseNumber,
                      String specialization, int yearsOfExperience, String affiliatedHospitalStatus,
                      double consultationFee, double baseSalary) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.medicalLicenseNumber = medicalLicenseNumber;
        this.specialization = specialization;
        this.yearsOfExperience = yearsOfExperience;
        this.affiliatedHospitalStatus = affiliatedHospitalStatus;
        this.consultationFee = consultationFee;
        this.baseSalary = baseSalary;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMedicalLicenseNumber() {
        return medicalLicenseNumber;
    }

    public void setMedicalLicenseNumber(String medicalLicenseNumber) {
        this.medicalLicenseNumber = medicalLicenseNumber;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getAffiliatedHospitalStatus() {
        return affiliatedHospitalStatus;
    }

    public void setAffiliatedHospitalStatus(String affiliatedHospitalStatus) {
        this.affiliatedHospitalStatus = affiliatedHospitalStatus;
    }

    public double getConsultationFee() {
        return consultationFee;
    }

    public void setConsultationFee(double consultationFee) {
        this.consultationFee = consultationFee;
    }

    public double getBaseSalary() {
        return baseSalary;
    }

    public void setBaseSalary(double baseSalary) {
        this.baseSalary = baseSalary;
    }

}
