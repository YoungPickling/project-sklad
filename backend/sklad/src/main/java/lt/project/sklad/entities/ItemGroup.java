package lt.project.sklad.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ItemGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "group_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JsonIgnoreProperties({"suppliers", "image", "user", "imageData", "locations", "items", "description"})
    @JoinColumn(name = "owner_id", nullable = false)
    private Company ownedByCompany;

    public ItemGroup(final String name, final Company ownedByCompany) {
        this.name = name;
        this.ownedByCompany = ownedByCompany;
    }
}
