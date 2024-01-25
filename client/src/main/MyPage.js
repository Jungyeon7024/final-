import React, { useEffect, useState } from 'react';
import usersUserinfoAxios from '../token/tokenAxios';

const MyPage = () => {
  const [userData, setUserData] = useState({});
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [introductionEditMode, setIntroductionEditMode] = useState(false);
  const [addressEditMode, setAddressEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newIntroduction, setNewIntroduction] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [updatingIntroduction, setUpdatingIntroduction] = useState(false);
  const [updatingAddress, setUpdatingAddress] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await usersUserinfoAxios.get('/users/userinfo');
        setUserData(response.data);
      } catch (error) {
        console.error('사용자 데이터를 가져오는 데 실패했습니다.', error);
      }
    };
    fetchUserData();
  }, []);
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  const handlePasswordEditToggle = () => {
    setPasswordEditMode(!passwordEditMode);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordsMatch(true);
  };
  const handleIntroductionEditToggle = () => {
    setIntroductionEditMode(!introductionEditMode);
    setNewIntroduction('');
    if (introductionEditMode) {
      handleUpdateIntroduction();
    }
  };
  const handleAddressEditToggle = () => {
    setAddressEditMode(!addressEditMode);
    setNewAddress('');
  };
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setPasswordsMatch(true);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(true);
  };
  const handleIntroductionChange = (e) => {
    setNewIntroduction(e.target.value);
  };
  const handleAddressChange = (e) => {
    setNewAddress(e.target.value);
  };
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }
    try {
      await usersUserinfoAxios.put('/users/updatePassword', {
        userNo: userData.user_no,
        newPassword: newPassword,
      });
      setPasswordEditMode(false);
    } catch (error) {
      console.error('비밀번호 업데이트에 실패했습니다.', error);
    }
  };
  const handleUpdateIntroduction = async () => {
    setUpdatingIntroduction(true);
    try {
      await usersUserinfoAxios.put('/users/updateIntroduction', {
        userNo: userData.user_no,
        newIntroduction: newIntroduction,
      });
    } catch (error) {
      console.error('자기 소개 업데이트에 실패했습니다.', error);
    } finally {
      setUpdatingIntroduction(false);
      setIntroductionEditMode(false);
    }
  };
  const handleUpdateAddress = async () => {
    setUpdatingAddress(true);
    try {
      await usersUserinfoAxios.put('/users/updateAddress', {
        userNo: userData.user_no,
        newAddress: newAddress,
      });
    } catch (error) {
      console.error('주소 업데이트에 실패했습니다.', error);
    } finally {
      setUpdatingAddress(false);
      setAddressEditMode(false);
    }
  };
  return (
    <div>
      <h1>마이 페이지</h1>
      {userData && (
        <ul>
          <li>이메일: {userData.email || 'N/A'}</li>
          <li>사용자 번호: {userData.user_no || 'N/A'}</li>
          <li>이름: {userData.username || 'N/A'}</li>
          <li>자기 소개: {userData.user_introduction || 'N/A'}</li>
          <li>주소: {userData.useraddress || 'N/A'}</li>
        </ul>
      )}
      <div>
        {passwordEditMode && (
          <div>
            <label>
              새로운 비밀번호:
              <input
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
              />
            </label>
            <label>
              확인용 비밀번호:
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </label>
            {!passwordsMatch && (
              <p style={{ color: 'red' }}>비밀번호가 일치하지 않습니다.</p>
            )}
            <button onClick={handleUpdatePassword}>저장</button>
          </div>
        )}
        {introductionEditMode && (
          <div>
            <label>
              새로운 자기 소개:
              <input
                type="text"
                value={newIntroduction}
                onChange={handleIntroductionChange}
              />
            </label>
            <button onClick={handleUpdateIntroduction}>
              {updatingIntroduction ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
        {addressEditMode && (
          <div>
            <label>
              새로운 주소:
              <input
                type="text"
                value={newAddress}
                onChange={handleAddressChange}
              />
            </label>
            <button onClick={handleUpdateAddress}>
              {updatingAddress ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
      </div>
      <div>
        <button onClick={handlePasswordEditToggle}>
          {passwordEditMode ? '취소' : '비밀번호 변경'}
        </button>
        <button onClick={handleIntroductionEditToggle}>
          {introductionEditMode ? '취소' : '자기 소개 변경'}
        </button>
        <button onClick={handleAddressEditToggle}>
          {addressEditMode ? '취소' : '주소 변경'}
        </button>
      </div>
    </div>
  );
};
export default MyPage;
