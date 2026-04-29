import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Hooks/useUser";
import { GET_USER } from "../graphql/queries";

export const Login = () => {

    const navigate = useNavigate();
    const {login, loginLoading, loginError, message, user} = useUser();

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
        }
    }

    if (loginLoading) return <p>Loading...</p>;

    return (
      <>
      <div className="flex items-center justify-center rounded-md min-h-screen ">
        <div className="w-full max-w-lg p-20 rounded-lg shadow-lg bg-myGrey h-200">
          <h1 className="text-4xl text-black font-bold flex justify-center">Login</h1>
            <form onSubmit={handleSubmit} className="pt-10">
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
        </div>

      </div>

      </>
    )
}