package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    /**
     * Image for this supplier
     */
    @OneToOne
    @JoinColumn(name = "image_id")
    private Image image;

    private String streetAndNumber;

    private String cityOrTown;

    @Column(length = 2)
    private String countryCode;

    private String postalCode;

    private String phoneNumber;

    private String phoneNumberTwo;

    private String website;

    @Lob
    private String description;

    /**
     * Company, which owns the supplier note
     */
    @ManyToOne(cascade = CascadeType.ALL)
    @JsonIgnoreProperties("suppliers")
    @JoinColumn(name = "owner_id", nullable = false)
    private Company owner;
}
