import React, { useState, useEffect } from "react";
import axios from "axios";

const GithubRegister = () => {
  const [githubData, setGithubData] = useState(null);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState(""); // 추가

  const githubLogin = () => {
    // 깃허브 로그인 페이지로 이동
    window.location.href =
      "https://github.com/login/oauth/authorize?client_id=008acb0e9a0e8e448aad&redirect_uri=http://localhost:8080/users/github/callback&scope=user";
  };

  const getGithubData = async (code) => {
    try {
      // GitHub에서 access token을 받아오는 부분
      const response = await axios.post(
        "http://localhost:8080/users/githubregister",
        {
          code,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setGithubData(data); // GitHub 데이터를 상태에 저장
        console.log("GitHub 데이터:", data);
      } else {
        console.error("GitHub 데이터를 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("GitHub 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const handleGithubRegister = async () => {
    try {
      // 서버에 GitHub 데이터와 직접 입력한 데이터로 회원가입 요청을 보내는 부분
      const response = await axios.post(
        "http://localhost:8080/users/githubregister",
        {
          githubData,
          email,
          address,
          username, // 추가
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("GitHub 회원가입 성공:", response.data);
        // 원하는 작업 수행 (예: 다음 페이지로 이동)
      } else {
        console.error("GitHub 회원가입 실패");
        // 실패 시 예외 처리
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    // URL에서 code 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const fetchData = async () => {
      if (code) {
        // GitHub 데이터 가져오기
        await getGithubData(code);
      }
    };

    fetchData();
  }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시에만 실행되도록 설정

  return (
    <div>
      <button onClick={githubLogin}>GitHub 로그인</button>

      {githubData && (
        <div>
          <p>GitHub 닉네임: {githubData.nickname}</p>
          <label>
            이메일:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <br />
          <label>
            주소:
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <br />
          <label>
            직접 입력한 사용자명:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleGithubRegister}>GitHub로 회원가입</button>
        </div>
      )}
    </div>
  );
};

export default GithubRegister;
