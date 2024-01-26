package lt.project.sklad.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad._security.entities.Company;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ImageData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Long size;

    /**
     * Company that owns this Image.
     * Made to display everything in
     * the company's gallery.
     */
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company ownedByCompany;

    @Lob
    @Column(name = "image_data", length = 2097152)
    private byte[] imageData;
}
