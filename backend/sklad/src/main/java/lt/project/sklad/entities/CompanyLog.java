package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CompanyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_log_id")
    private Long id;

    @Column(nullable = false)
    private Long userId;

    /** The first name of the user. */
    @Column(nullable = false)
    private String firstname;

    /** The last name of the user. */
    @Column(nullable = false)
    private String lastname;

    @Column(nullable = false)
    private String username;

    @ManyToOne
    @JsonIgnoreProperties({"suppliers", "image", "user", "imageData", "locations", "items", "description"})
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String action;

    /** action. */
    @JsonProperty("date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd' 'HH:mm:ss")
    @Column(name="reg_date", nullable = false, columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    private LocalDateTime registrationDate;
}
