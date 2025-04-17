package edu.cit.mediflow.repository;

import edu.cit.mediflow.entity.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {}