import { useState } from "react";
import { LOGIN_USER } from "../graphql/mutations";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Hooks/useUser";
import { GET_USER } from "../graphql/queries";

export const Login = () => {

    const navigate = useNavigate();
    const {login, loginLoading, loginError, message, user, setMessage} = useUser();

    const {refetch} = useQuery(GET_USER, {
        skip: !user
    });

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login(formData.username, formData.password, navigate);

        if (!loginError)
        {
          refetch();
          setMessage("Login successful");
        }
    }

    if (loginLoading) return <p>Loading...</p>;

    return (
      <>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Login</button>
          {message && <p>{message}</p>}
          {loginError && <p style={{color: "red"}}>Error: {loginError.message}</p>}
        </form>
      </>
    )
}