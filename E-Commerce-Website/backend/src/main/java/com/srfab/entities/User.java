package com.srfab.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userid")
    private int userId;
    
    @NotBlank(message = "Name is required")
    @Size(max = 100)
    @Column(name = "name", length = 100)
    private String userName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100)
    @Column(name = "email", length = 100, unique = true)
    private String userEmail;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "password", length = 100)
    private String userPassword;
    
    @Pattern(regexp = "^\\d{10}$", message = "Phone number must be 10 digits")
    @Column(name = "phone", length = 20, unique = true)
    private String userPhone;
    
    @Column(name = "gender", length = 20)
    private String userGender;
    
    @Column(name = "registerdate")
    private Timestamp dateTime;
    
    @Column(name = "address", length = 250)
    private String userAddress;
    
    @Column(name = "city", length = 100)
    private String userCity;
    
    @Column(name = "pincode", length = 10)
    private String userPincode;
    
    @Column(name = "state", length = 100)
    private String userState;
}
