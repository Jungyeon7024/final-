package lm.swith.user.controller;


import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.servlet.http.HttpServletRequest;
import lm.swith.user.Service.GithubUserService;
import lm.swith.user.Service.KakaoService;
import lm.swith.user.Service.MailService;
import lm.swith.user.Service.UserService;
import lm.swith.user.common.MsgEntity;
import lm.swith.user.model.ResponseDTO;
import lm.swith.user.model.SwithDTO;
import lm.swith.user.model.SwithUser;
import lm.swith.user.token.TokenProvider;
import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(origins="http://localhost:3000", allowCredentials = "true")
public class RegisterController {
	
	private final KakaoService kakaoService;
	private final UserService userService;
	private final MailService mailService;
	private final JavaMailSender javaMailSender;
	private final TokenProvider tokenProvider;
	private final PasswordEncoder passwordEncoder;
	
	@Autowired
    private final GithubUserService githubService;
	private SwithUser userData = new SwithUser(); // 가상의 사용자 데이터
	// -------- 토큰 발급 --------
	@PostMapping("/signin")
	public ResponseEntity<?> authenticate(@RequestBody SwithDTO siwthDTO) {
		SwithUser user = userService.getByCredentials(siwthDTO.getEmail(), siwthDTO.getPassword(), passwordEncoder);
		
        	// 사용자의 id, pwd 일치할 경우
		if(user != null) {
			// 토큰 생성
			final String token = tokenProvider.createAccessToken(user);  
			final SwithDTO responseUserDTO = SwithDTO.builder()
					.email(user.getEmail())
					.user_no(user.getUser_no())
					.username(user.getUsername())
					.useraddress(user.getUseraddress())
					.nickname(user.getNickname())
					.token(token)          //반환된 토큰 적용
					.build();
			return ResponseEntity.ok().body(responseUserDTO);
		} else {
			ResponseDTO responseDTO = ResponseDTO.builder()
					.error("Login faild.")
					.build();
			return ResponseEntity.badRequest().body(responseDTO);
		}
		
	}
	
	@GetMapping("/userinfo")
	public ResponseEntity<SwithUser> getUserInfo() {
        // 현재 인증된 사용자의 정보를 가져오는 로직
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        String userEmail = authentication.getName();
        // MyBatis를 이용하여 사용자 정보를 조회
        SwithUser user = userService.getUserByEmail(userEmail);
        byte[] profile_img = user.getUser_profile();//blob형태를 base64로 인코딩해주는 코드
        String imageBase64 = Base64.getEncoder().encodeToString(profile_img);
        
        String cutString = imageBase64.substring(imageBase64.indexOf("data:image/jpeg;base64") + "data:image/jpeg;base64".length());
        String imageUrl = "data:image/jpeg;base64,/" + cutString;
        user.setPassword(null);//조회할때 패스워드 안나오게 하려고 null값을 준다.
        user.setImg(imageUrl);//단순 출력용 blob을 string형태로 출력하기위함 
      
        return ResponseEntity.ok(user);
      }
	  @GetMapping("/")
	  public String MailPage(){
	      return "/";
	  }
	  
	  @ResponseBody
	  @PostMapping("/mail")
	  public ResponseEntity<String> MailSend(@RequestBody SwithUser swithUser){
	  	// MailService 객체 생성 
	  	MailService mailService = new MailService(javaMailSender);//send mail 
	    //comparing email
	  	SwithUser user = userService.getUserByEmail(swithUser.getEmail()); 
	  
	  	//넣은 값이 db에 존재하는지, 넣은 값이 null이 아닌 
	  	if(user != null && user.getEmail() != null) { //find해서 값이 존재하면 거부, null이면 
	  		String exists = "exists";
	  		 return ResponseEntity.ok(exists);
	     
	  	 }else {
	  		int number = mailService.sendMail(swithUser.getEmail());
		     String num = "" + number;
		     return ResponseEntity.ok(num);
	  	 }
	  }
	  
	  @GetMapping("/register")
	  public String showRegisterForm(Model model) {
		  model.addAttribute("users",new SwithUser());
		  return "register";
	  }
	/*@GetMapping("/register")
	public List<SwithUser> findUsersAll() {
		return userService.findUsersAll();
	}
	*/	
	@PostMapping("/register")
	public ResponseEntity<SwithUser> registerUser(@RequestBody SwithUser swithUser) throws IOException{
		String imageData = swithUser.getImg().split(",")[1];
        byte[] imageBytes = Base64.getDecoder().decode(imageData);//디코딩해서 blob 형태로 다시 넣어줌
        
     // BufferedImage로 이미지 읽기
        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
        BufferedImage originalImage = ImageIO.read(bis);
        bis.close();

        // 이미지 크기 조절 (예: 가로 100px로 조절)
        int newWidth = 500;
        int newHeight = (int) (originalImage.getHeight() * (1.0 * newWidth / originalImage.getWidth()));
        BufferedImage resizedImage = new BufferedImage(newWidth, newHeight, BufferedImage.TYPE_INT_ARGB);
        resizedImage.getGraphics().drawImage(originalImage, 0, 0, newWidth, newHeight, null);

        // 압축된 이미지를 Base64로 인코딩
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ImageIO.write(resizedImage, "png", bos);
        byte[] compressedImageBytes = bos.toByteArray();
        bos.close();
        
        swithUser.setUser_profile(compressedImageBytes);
		SwithUser createUser = userService.signUpUser(swithUser);
		return ResponseEntity.ok(createUser);
	}
	

	
	
	@GetMapping("/kakao/callback")
    public String callback(HttpServletRequest request,
                           @RequestParam(required = false) String password,
                           @RequestParam(required = false) String userName, 
                           @RequestParam(required = false) byte[] userProfile,
                           @RequestParam(required = false) String userAddress,
                           @RequestParam(required = false) String userIntroduction,
                           @RequestParam(required = false) String role,
                           Model model) throws Exception {

        SwithUser kakaoInfo = kakaoService.getKakaoInfo(request.getParameter("code"), password,userName, userProfile,userAddress,userIntroduction,role );
        model.addAttribute("kakaoInfo", kakaoInfo);
        return "kakaoRegister";
    }
    @PostMapping("/kakaoregister")
    public ResponseEntity<MsgEntity> registerUser(@RequestParam String email,
									    		  @RequestParam String password,
										          @RequestParam String userName,
										          @RequestParam String nickname,
										          @RequestParam byte[] userProfile,
										          @RequestParam String userAddress, 
												  @RequestParam String userIntroduction, 
												  @RequestParam String role
												  ) {
        SwithUser swithUser = SwithUser.builder()
        		.email(email)
        		.password(password)
                .username(userName)
                .nickname(nickname)
                .user_profile(userProfile)
                .useraddress(userAddress)
                .user_introduction(userIntroduction)
                .role(role)
                .build();

        SwithUser registeredUser = userService.signUpUser(swithUser);
        
        
        return ResponseEntity.ok()
                .body(new MsgEntity("Success", registeredUser));
       /* String redirectUrl = request.getContextPath() + "/";
        MsgEntity responseMsg = new MsgEntity("Success", registeredUser, redirectUrl);

        return ResponseEntity.ok()
                .body(responseMsg);
                */
    }
    
  
   
      @GetMapping("/github/callback")
 
		    public String callback(HttpServletRequest request,
		                           @RequestParam(required = false) String username,
		                           @RequestParam(required = false) String email, Model model) throws Exception {

	        	SwithUser githubInfo = githubService.getGithubInfo(request.getParameter("code"), username);
		        model.addAttribute("githubInfo", githubInfo);
		        return "githubregister";
		    }   
    
    @PostMapping("/github/register")
    public ResponseEntity<MsgEntity> registerUser(@RequestParam String email,
                                                  @RequestParam String nickname,
                                                  @RequestParam String username
                                                 ) {
    	SwithUser swithUser = SwithUser.builder()
    			.email(email)
                .nickname(nickname)
                .username(username)
                .build();
    	SwithUser registeredUser = githubService.registerUser(swithUser);
        return ResponseEntity.ok()
                .body(new MsgEntity("Success", registeredUser));
    }
    
    @GetMapping("/github/login-url")
    public ResponseEntity<String> getGithubLoginUrl() {
        String githubLoginUrl = githubService.getGithubLogin();
        return ResponseEntity.ok().body(githubLoginUrl);
    }

    
}
   

   


    
    
    
    
    
    
    
    
    
    
    
    
    

