import React, { useState } from "react";

const GithubRegister = () => {
  const [githubInfo, setGithubInfo] = useState(null);

  const handleGithubLogin = async () => {
    try {
      const response = await fetch("http://localhost:8080/users/github/login-url");

      if (response.status !== 200) {
        throw new Error(
          `Failed to fetch GitHub login URL. Status: ${response.status}`
        );
      }

      const githubUrl = await response.text();
      window.location.href = githubUrl;
    } catch (error) {
      console.error("GitHub login error:", error);
    }
  };

  return (
    <div>
      <p>
        <button onClick={handleGithubLogin}>깃허브로그인</button>
      </p>
      {githubInfo && (
        <div>
          <p>깃허브 이메일: {githubInfo.email}</p>
        </div>
      )}
    </div>
  );
};

export default GithubRegister;
