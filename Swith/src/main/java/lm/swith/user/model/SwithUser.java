package lm.swith.user.model;


import lombok.*;

@Builder
@Getter
@Setter
public class SwithUser {
    private Long user_no;
    private String email;
    private String password;
    private String username;
    private String nickname;
    private byte[] user_profile;
    private String img;
    private String useraddress;
    private String user_introduction;
    private String role;
    private String userIntroduction;
    private String introduction;

    public SwithUser() {}

    // 롬복을 사용한 빌더 패턴을 통한 생성자 자동 생성
    @Builder
    public SwithUser(Long user_no, String email, String password, String username, String nickname,
            byte[] user_profile, String img, String useraddress, String user_introduction, String role,
            String userIntroduction, String introduction) {
        this.user_no = user_no;
        this.email = email;
        this.password = password;
        this.username = username;
        this.nickname = nickname;
        this.user_profile = user_profile;
        this.img = img;
        this.useraddress = useraddress;
        this.user_introduction = user_introduction;
        this.role = role;
        this.userIntroduction = userIntroduction;
        this.introduction = introduction;
    }

    // 롬복을 사용하여 getter 및 setter 메서드 자동 생성
    @Getter
    @Setter
    public static class UpdateIntroductionRequest {
        private String introduction;
    }
}
