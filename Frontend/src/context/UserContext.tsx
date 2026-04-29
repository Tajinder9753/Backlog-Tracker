import { createContext, useState } from "react";
import { useQuery, useMutation, ApolloError } from "@apollo/client";
import { GET_USER } from "../graphql/queries";
import { LOGIN_USER, REGISTER_USER } from "../graphql/mutations";

interface UserContextType {
    user: any;
    login: (username: string, password: string, navigate: Function) => Promise<void>;
    loginLoading: boolean;
    loginError: ApolloError | undefined;
    register: (username: string, password: string, email: string, navigate: Function) => Promise<void>;
    registerLoading: boolean;
    registerError: ApolloError | undefined;
    message: string;
    loadingUser: boolean;
    userError: ApolloError | undefined;
    setMessage: (message: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [message, setMessage] = useState("");

    const {data: userData, loading: loadingUser, error: userError} = useQuery(GET_USER, {
        fetchPolicy: "network-only"
    });

    const [loginUser, {loading: loginLoading, error: loginError}] = useMutation(LOGIN_USER);

    const [registerUser, {loading: registerLoading, error: registerError}] = useMutation(REGISTER_USER);

    async function login(username : string, password : string, navigate : Function) 
    {
        try {
            const {data} = await loginUser({
                variables: { username, password }
            });

            if (data?.loginUser)
            {
                setMessage("Login successful");
                navigate("/dashboard");
            } else {
                setMessage("Login Failed");
            }
        } catch (err)
        {
            console.error("Login failed:", err);
            setMessage("Login Failed");
        }
    }

    async function register(username: string, password: string, email: string, navigate: Function)
    {
        try {
            await registerUser({
                variables: { username, password, email }
            })
            setMessage("Registration successful");
        setTimeout(()=> {
            setMessage("");
             navigate("/login");
        }, 2000);
           
        } catch (err) {
            console.error("Registration failed:", err);
            setMessage("Registration Failed");
        }
    }

    return (
        <UserContext.Provider
            value={{
                user: userData?.getUser,
                login,
                register,
                registerLoading,
                registerError,
                loginLoading,
                loginError,
                message,
                loadingUser,
                userError,
                setMessage
            }}
        >
            {children}
        </UserContext.Provider>
    )
}