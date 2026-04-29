import { useNavigate } from "react-router-dom"
import { useUser } from "../Hooks/useUser";
import { useState } from "react";

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
        <div>
            <h1>Register Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" disabled={registerLoading}>
                    {registerLoading ? "Registering..." : "Register"}
                </button>
            </form>
            {message && <p>{message}</p>}
            {registerError && <p style={{color: "red"}}>Error: {registerError.message}</p>}
        </div>
    )
}