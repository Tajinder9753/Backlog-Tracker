import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../Hooks/useUser";
import { GET_USER } from "../graphql/queries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            const success = await login(formData.username, formData.password);
            if (success) {
                await refetch();
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    if (loginLoading) return <p>Loading...</p>;

    return (
      <>
      <div className="flex items-center justify-center rounded-md min-h-screen ">
        <div className="w-full max-w-lg p-20 rounded-lg shadow-lg bg-myGrey h-200">
          <h1 className="text-4xl text-black font-bold flex justify-center">Login</h1>
            <form onSubmit={handleSubmit} className="pt-10">
              <div className="p-5">
                <Label htmlFor="username">Username:</Label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div className="p-5">
                <Label htmlFor="password">Password:</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
              <div className="p-5">
                <Button type="submit">Login</Button>
                {message && <p>{message}</p>}
                {loginError && <p style={{color: "red"}}>Error: {loginError.message}</p>}
              </div>

            </form>
            <p className="text-black py-4">Don't have an account? Register here: 
              <Link to = "/register" className="font-medium text-fg-brand hover:underline">Register</Link>
            </p>
        </div>
      </div>

      </>
    )
}