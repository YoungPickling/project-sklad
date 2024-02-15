package lt.project.sklad.entities;

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
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long id;

    /**
     * Company that owns this warehouse location note
     */
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "owner_id", nullable = false)
    private Company owner;

    @Column(name = "location_name")
    private String locationName;

    /**
     * Image for the location
     */
    @OneToOne
    @JoinColumn(name = "image_id")
    private Image image;

    @Column(name = "street_and_number")
    private String streetAndNumber;

    @Column(name = "city_or_town")
    private String cityOrTown;

    @Column(name = "country_code", length = 2)
    private String countryCode;

    @Column(name = "postal_code")
    private String postalCode;

    private String phoneNumber;

    private String phoneNumberTwo;

    @Lob
    private String description;
}
