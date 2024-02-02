package lm.swith.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@CrossOrigin(origins="http://localhost:3000", allowCredentials = "true")
public class HomeController {
	 @GetMapping("/github/login-url")
	    public ResponseEntity<String> getGithubLoginUrl() {
	        String githubLoginUrl = githubService.getGithubLogin();
	        return ResponseEntity.ok().body(githubLoginUrl);
	    }
}
