import React, { useState, useEffect } from 'react';
import usersUserinfoAxios from '../token/tokenAxios';
import Header from './Header';
import axios from 'axios';
import sample6_execDaumPostcode from './KakaoAddress';
import { useNavigate } from 'react-router-dom';
import { logout, isTokenAvailable } from '../token/tokenAxios';
const UpdateUser = () => {
  //주소값

  const [confirmNickname, setConfirmNickname] = useState(''); //nickname 중복확인
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const navigate = useNavigate();

  const [userData, setNewUser] = useState({
    email: '',
    password: '',
    nickname: '',
    user_profile: '',
    img: '',
    useraddress: '',
    user_introduction: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버에 사용자 정보를 가져오는 요청
        const response = await usersUserinfoAxios.get('/users/userinfo');
        setNewUser(response.data); // 로그인한 토큰 이용해서 해당 유저 데이터 가져오는거
        console.log(userData);
      } catch (error) {
        console.error('Failed to fetch user data.', error);
      }
    };

    fetchUserData();
  }, []);


  
}
  export default UpdateUser;