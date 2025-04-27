package mediflow.g5.cit.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "user_doctor")
public class UserDoctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doctor_id")
    private Long doctorId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Username is required")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;

    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid contact number")
    private String contactNumber;

    private String medicalLicenseNumber;
    private String specialization;
    private int yearsOfExperience;
    private String affiliatedHospitalStatus;
    private double consultationFee;
    private double baseSalary;
    private boolean isAvailable;

    // Constructors
    public UserDoctor() {
    }

    public UserDoctor(Long doctorId, String firstName, String lastName, String username, String password,
                      String email, String contactNumber, String medicalLicenseNumber, String specialization,
                      int yearsOfExperience, String affiliatedHospitalStatus, double consultationFee,
                      double baseSalary, boolean isAvailable) {
        this.doctorId = doctorId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.email = email;
        this.contactNumber = contactNumber;
        this.medicalLicenseNumber = medicalLicenseNumber;
        this.specialization = specialization;
        this.yearsOfExperience = yearsOfExperience;
        this.affiliatedHospitalStatus = affiliatedHospitalStatus;
        this.consultationFee = consultationFee;
        this.baseSalary = baseSalary;
    }

    // Getters and Setters
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public String getMedicalLicenseNumber() { return medicalLicenseNumber; }
    public void setMedicalLicenseNumber(String medicalLicenseNumber) { this.medicalLicenseNumber = medicalLicenseNumber; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public int getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(int yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    public String getAffiliatedHospitalStatus() { return affiliatedHospitalStatus; }
    public void setAffiliatedHospitalStatus(String affiliatedHospitalStatus) { this.affiliatedHospitalStatus = affiliatedHospitalStatus; }
    public double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(double consultationFee) { this.consultationFee = consultationFee; }
    public double getBaseSalary() { return baseSalary; }
    public void setBaseSalary(double baseSalary) { this.baseSalary = baseSalary; }

}