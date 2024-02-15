package lt.project.sklad._security.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lt.project.sklad.entities.Company;
import lt.project.sklad.entities.Image;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * <p>&emsp;Entity class representing a user in the application. This class encapsulates
 * user-related information and implements the {@link UserDetails} interface to
 * integrate with Spring Security.</p>
 *
 * <p>&emsp;This class stores details about a user, including a unique {@link #id},
 * {@link #firstname}, {@link #lastname}, {@link #username}, {@link #email},
 * {@link #password} hash, {@link #role}, {@link #tokens}.</p>
 *
 * @version 1.0, 15 Aug 2023
 * @since 1.0, 3 Aug 2023
 * @author Maksim Pavlenko
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
// This annotation below is required for proper Json mapping.
// The User class implements UserDetails and jackson-annotations
// library is trying to serialize the Hibernate proxy object
// associated with the User entity but fails and throws an error.
// This annotation below fixes the bug.
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements UserDetails {
	/** The unique identifier for the user. */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id", nullable = false, unique = true)
	private Long id;

	/** The first name of the user. */
	@Column(nullable = false)
	private String firstname;

	/** The last name of the user. */
	@Column(nullable = false)
	private String lastname;

	/** The username of the user. */
	@Column(nullable = false)
	private String username;

	/** Avatar image for the user. */
	@JsonIgnoreProperties({"id", "size", "compressedSize", "ownedByCompany", "imageData"})
	@OneToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "image_id")
	private Image image;

	/** Companies user belongs to. */
	@ManyToMany(mappedBy = "user", fetch = FetchType.EAGER)
	@JsonIgnoreProperties({"user", "locations", "items", "suppliers", "imageData"})
	private List<Company> company;

	/** The email address of the user. */
	@Column(nullable = false)
	private String email;

	/** The hashed password of the user. */
	@JsonIgnore
	@Column(nullable = false)
	private String password;

	/** The role of the user within the application. */
	@Column(nullable = false)
	@Enumerated(EnumType.STRING)
	private Role role;

	/** The list of tokens associated with the user. */
//	@JsonIgnoreProperties("user")
	@JsonIgnore
	@OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
	private List<Token> tokens;

	/** registration date. */
	@JsonProperty("reg_data")
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd' 'HH:mm:ss")
	@Column(name="reg_date",nullable = false, columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
	private LocalDateTime registrationDate;
	/**
	 * Returns the authorities that are assigned
	 * to the user's role.
	 * @return the collection of granted authorities
	 */
	@JsonIgnore
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return role.getAuthorities();
	}
	/**
	 * Returns the user's password.
	 * @return the user's password
	 */
	@Override
	public String getPassword() {
		return password;
	}
	/**
	 * Returns the user's username.
	 * @return the user's username
	 */
	@Override
	public String getUsername() {
		return username;
	}
	/**
	 * Checks whether the user's account is non-expired.
	 * @return {@code true} if the account is non-expired, otherwise {@code false}
	 */
	@Override
	@JsonIgnore
	public boolean isAccountNonExpired() {
		return true;
	}
	/**
	 * Checks whether the user's account is non-locked.
	 * @return {@code true} if the account is non-locked,
	 * otherwise {@code false} */
	@Override
	@JsonIgnore
	public boolean isAccountNonLocked() {
		return true;
	}
	/**
	 * Checks whether the user's credentials are non-expired.
	 * @return {@code true} if the credentials are non-expired,
	 * otherwise {@code false}
	 */
//	@JsonProperty("credentials_non_expired")
	@JsonIgnore
	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}
	/**
	 * Checks whether the user's account is enabled.
	 * @return {@code true} if the account is enabled,
	 * otherwise {@code false}
	 */
	@JsonIgnore
	@Override
	public boolean isEnabled() {
		return true;
	}
}