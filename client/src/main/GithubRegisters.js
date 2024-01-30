import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const GithubRegisterForm = ({ githubInfo }) => {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

  };





  return (
    <div>
      <h2>Git Hub Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email: </label>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <label>Nickname: </label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          value={githubInfo.nickname}
          readOnly
        />
        <br />
        <label>Name: </label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <label>Birthdate: </label>
        <input
          type="text"
          id="birthdate"
          name="birthdate"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
        <br />
        <input type="submit" value="가입완료" />
      </form>
    </div>
  );
};

export default GithubRegisterForm;
