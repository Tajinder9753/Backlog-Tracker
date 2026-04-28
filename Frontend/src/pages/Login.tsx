import { useState } from "react";
import { LOGIN_USER } from "../graphql/mutations";
import { useMutation } from "@apollo/client";

export const Login = () => {

    const [loginUser, {loading, error }] = useMutation(LOGIN_USER);

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

    async function Login(username: string, password: string)
    {
        try {
            await loginUser({
                variables: { username, password}
            })

            console.log("Login successful");
        } catch (err) {
            console.error("Login failed:", err);
        }
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        await Login(formData.username, formData.password);

        if (!error)
        {
            console.log("Login successful");
        }
    }

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
        </form>
      </>
    )
}