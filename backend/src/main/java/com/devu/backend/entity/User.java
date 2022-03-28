package com.devu.backend.entity;

import lombok.*;

import javax.persistence.*;

@Getter @Setter
@Builder
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private boolean emailConfirm;

    private String emailAuthKey;
}
