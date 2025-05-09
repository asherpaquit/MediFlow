package mediflow.g5.cit.controller;

import mediflow.g5.cit.entity.MedicalRecord;
import mediflow.g5.cit.service.MedicalRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {
    @Autowired
    private MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@RequestBody MedicalRecord medicalRecord) {
        MedicalRecord createdRecord = medicalRecordService.createMedicalRecord(medicalRecord);
        return ResponseEntity.ok(createdRecord);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByPatient(@PathVariable Long patientId) {
        List<MedicalRecord> records = medicalRecordService.getMedicalRecordsByPatientId(patientId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecord> records = medicalRecordService.getMedicalRecordsByDoctorId(doctorId);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/prescription/{prescriptionId}")
    public ResponseEntity<MedicalRecord> getMedicalRecordByPrescription(@PathVariable Long prescriptionId) {
        MedicalRecord record = medicalRecordService.getMedicalRecordByPrescriptionId(prescriptionId);
        return ResponseEntity.ok(record);
    }
}
