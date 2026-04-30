import { useNavigate } from "react-router-dom"
import { useUser } from "../Hooks/useUser";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Register = () => {
    const navigate = useNavigate();
    const {register, registerLoading, registerError, message} = useUser();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register(formData.username, formData.password, formData.email, navigate);
    }
    return (
        <div className="flex items-center justify-center rounded-md min-h-screen">
            <div className="w-full max-w-lg p-20 rounded-lg shadow-lg bg-myGrey h-200">
                <h1 className="text-4xl text-black font-bold flex justify-center" >Register Page</h1>
                <form onSubmit={handleSubmit} className="pt-10">
                    <div className="p-5">
                        <Label>Username:</Label>
                        <Input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="bg-white"
                        />
                    </div>
                    <div className="p-5">
                        <Label>Email:</Label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-white"
                        />
                    </div>
                    <div className="p-5">
                        <Label>Password:</Label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="bg-white"
                        />
                    </div>
                    <div className="p-5">
                        <Button type="submit" disabled={registerLoading}>
                            {registerLoading ? "Registering..." : "Register"}
                        </Button>
                    </div>

                </form>
                {message && <p>{message}</p>}
                {registerError && <p style={{color: "red"}}>Error: {registerError.message}</p>}
            </div>   
        </div>
    )
}