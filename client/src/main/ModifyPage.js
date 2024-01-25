import React, { useEffect, useState } from "react";
import usersUserinfoAxios from "../token/tokenAxios";

const MyPage = () => {
  const [userData, setUserData] = useState({});
  const [newIntroduction, setNewIntroduction] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Add state for editing

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await usersUserinfoAxios.get("/users/userinfo");
        setUserData(response.data);
        setNewIntroduction(response.data.user_introduction || "");
      } catch (error) {
        console.error("사용자 데이터를 가져오는 데 실패했습니다.", error);
      }
    };
    fetchUserData();
  }, []);

  const handleIntroductionChange = (e) => {
    setNewIntroduction(e.target.value);
  };

  const handleUpdateIntroduction = async () => {
    try {
      const response = await usersUserinfoAxios.put(
        "/users/updateIntroduction",
        {
          introduction: newIntroduction,
        }
      );
      setUserData(response.data);//기존데이터 
      setNewIntroduction(""); // 새로넣을 데이터
      setIsEditing(false); // Reset editing state after update
    } catch (error) {
      console.error("자기 소개 업데이트에 실패했습니다.", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div>
      <h1>마이 페이지</h1>
      {userData && (
        <ul>
          <li>이메일: {userData.email || "N/A"}</li>
          <li>사용자 번호: {userData.user_no || "N/A"}</li>
          <li>이름: {userData.username || "N/A"}</li>
          <li>
            자기 소개:
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={newIntroduction}
                  onChange={handleIntroductionChange}
                />
                <button onClick={handleUpdateIntroduction}>업데이트</button>
              </div>
            ) : (
              <span>{userData.user_introduction || "N/A"}</span>
            )}
            {isEditing || <button onClick={handleEditClick}>수정하기</button>}
          </li>
          <li>주소: {userData.useraddress || "N/A"}</li>
        </ul>
      )}
    </div>
  );
};

export default MyPage;
