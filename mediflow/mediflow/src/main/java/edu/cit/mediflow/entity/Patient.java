package edu.cit.mediflow.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Document(collection = "patient")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Patient {
    @Id
    private String patientId;
    private String name;
    private String dateOfBirth;
    private String gender;
    private String contactInfo;
    private List<HealthNotification> healthNotifications;
}
