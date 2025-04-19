package edu.cit.mediflow.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.lang.annotation.Documented;


@Document(collection = "prescription")
@Data
@AllArgsConstructor
@NoArgsConstructor
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
