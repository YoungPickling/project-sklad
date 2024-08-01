package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
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

    @Column(name = "name")
    private String name;

    /**
     * Image for the location
     */
    @OneToOne
    @JoinColumn(name = "image_id")
    private Image image;

    @JsonProperty("street_and_number")
    @Column(name = "street_and_number")
    private String streetAndNumber;

    @JsonProperty("city_or_town")
    @Column(name = "city_or_town")
    private String cityOrTown;

    @JsonProperty("country_code")
    @Column(name = "country_code", length = 2)
    private String countryCode;

    @JsonProperty("postal_code")
    @Column(name = "postal_code")
    private String postalCode;

    @JsonProperty("phone_number")
    @Column(name = "phone_number")
    private String phoneNumber;

    @JsonProperty("phone_number_two")
    @Column(name = "phone_number_two")
    private String phoneNumberTwo;

    @Lob
    private String description;

    /**
     * Company that owns this warehouse location note
     */
    @ManyToOne
    @JsonIgnoreProperties({"suppliers", "image", "user", "imageData", "locations", "items", "description"})
    @JoinColumn(name = "owner_id", nullable = false)
    private Company owner;
}
