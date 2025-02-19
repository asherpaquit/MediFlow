package edu.cit.mediflow.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "healthNotification")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HealthNotification {
    @Id
    private String notificationId;
    private String message;
    private String date;
    private String time;
    private String type;

}
