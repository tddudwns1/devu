package com.devu.backend.controller.user;

import com.devu.backend.config.auth.token.TokenService;
import com.devu.backend.controller.ResponseErrorDto;
import com.devu.backend.entity.User;
import com.devu.backend.service.UserService;
import com.devu.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController("/")
public class UserController {
    private final UserService userService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @GetMapping("/")
    private ResponseEntity home() {
        return ResponseEntity.ok().body("홈 테스트");
    }

    //회원가입 Form에서 이메일 검증 api => Form Data로 넘어와야함
    @PostMapping("/key")
    private ResponseEntity<?> getKeyFromUser(@RequestParam String postKey) {
        User user = userService.getByAuthKey(postKey);
        if (user == null) {
            return ResponseEntity.badRequest().body("Wrong AuthKey from User");
        }
        user.setEmailConfirm(true);
        userService.updateUserConfirm(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }


    //TODO : 1) Email 전송 속도 개선(현재 5초), 2)Email AuthKey 제한시간 5분
    @PostMapping("/email")
    private ResponseEntity<?> sendEmail(@RequestParam String email){
        try {
            if (userService.isEmailExists(email)) {
                String authKey = emailService.createKey();
                emailService.sendValidationMail(email, authKey);
                userService.updateUserAuthKey(email,authKey);
                log.info("Email 재전송 완료 : {}",email);
                return ResponseEntity.ok().body("이메일 재전송 완료");
            }
            //email로 인증번호 먼저 보내고, 인증번호 get
            String authKey = emailService.createKey();
            emailService.sendValidationMail(email,authKey);
            log.info("Email authKey = {}", authKey);
            User user = User.builder()
                    .email(email)
                    .emailAuthKey(authKey)
                    .emailConfirm(false)
                    .build();
            User savedUser = userService.createUser(user.getEmail(), user.getEmailAuthKey());
            UserDTO userDTO = UserDTO.builder()
                    .email(savedUser.getEmail())
                    .build();
            log.info("Email 전송 완료 : {}",email);
            return ResponseEntity.ok(userDTO);
        } catch (Exception e) {
            e.printStackTrace();
            ResponseErrorDto errorDto = ResponseErrorDto.builder()
                    .error(e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorDto);
        }
    }


    //회원가입 => 기본 EmailConfirm = false
    //Json으로 넘어와야함
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userCreateRequestDto) {
        try {
            User user = userService.getByEmail(userCreateRequestDto.getEmail());
            user.setUsername(userCreateRequestDto.getUsername());
            user.setPassword(passwordEncoder.encode(userCreateRequestDto.getPassword()));
            User updatedUser = userService.updateUser(user);
            UserDTO userDTO = UserDTO.builder()
                    .email(updatedUser.getEmail())
                    .username(updatedUser.getUsername())
                    .build();
            return ResponseEntity.ok().body(userDTO);

        } catch (Exception e) {
            ResponseErrorDto errorDto = ResponseErrorDto.builder()
                    .error(e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorDto);
        }
    }

    //Content-Type : JSON
    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        try {
            User user = userService.getByCredentials(userDTO.getEmail(), userDTO.getPassword());
            String jwt = tokenService.createToken(userDTO.getEmail());
            UserDTO responseUserDTO = UserDTO.builder()
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .token(jwt)
                    .build();
            log.info("username : {} -> 로그인 성공",user.getUsername());
            return ResponseEntity.ok().body(responseUserDTO);
        } catch (Exception e) {
            log.warn(e.getMessage());
            ResponseErrorDto errorDto = ResponseErrorDto.builder()
                    .error(e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorDto);
        }
    }

}