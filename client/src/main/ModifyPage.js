import React, { useEffect, useState } from "react";
import usersUserinfoAxios from "../token/tokenAxios";

const MyPage = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [newIntroduction, setNewIntroduction] = useState("");
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await usersUserinfoAxios.get("/users/userinfo");
        setUserData(response.data);
        setNewIntroduction(response.data.user_introduction || "");
      } catch (error) {
        console.error("사용자 데이터를 가져오는 데 실패했습니다.", error);
        setError("사용자 데이터를 가져오는 데 실패했습니다.");
      }
    };
    fetchUserData();
  }, []);

  const handleIntroductionChange = (e) => {
    setNewIntroduction(e.target.value);
  };

  const handleUpdateIntroduction = async () => {
    try {
      const response = await usersUserinfoAxios.post(
        "/users/updateIntroduction",
        {
          introduction: newIntroduction,
        }
      );

      // 여기에서 응답 형식을 확인하고 필요에 따라 수정
      if (response && response.data) {
        setUserData(response.data);
        setIsEditing(false); // 성공적인 업데이트 후 편집 모드 종료
      } else {
        console.error("서버 응답 형식이 예상과 다릅니다.");
        setError("서버 응답 형식이 예상과 다릅니다.");
      }
    } catch (error) {
      console.error("자기 소개 업데이트에 실패했습니다.", error);
      setError("자기 소개 업데이트에 실패했습니다.");
    }
  };

  return (
    <div>
      <h1>마이 페이지</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {userData && (
        <ul>
          <li>이메일: {userData.email || "N/A"}</li>
          <li>사용자 번호: {userData.user_no || "N/A"}</li>
          <li>이름: {userData.username || "N/A"}</li>
          <li>
            자기 소개:{" "}
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={newIntroduction}
                  onChange={handleIntroductionChange}
                />
                <button onClick={handleUpdateIntroduction}>저장</button>
              </div>
            ) : (
              <span>{userData.user_introduction || "N/A"}</span>
            )}
            <button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "취소" : "수정"}
            </button>
          </li>
          <li>주소: {userData.useraddress || "N/A"}</li>
        </ul>
      )}
    </div>
  );
};

export default MyPage;
