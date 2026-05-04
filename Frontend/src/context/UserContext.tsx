import { createContext, useState } from "react";
import { useQuery, useMutation, ApolloError, useApolloClient } from "@apollo/client";
import { GET_USER } from "../graphql/queries";
import { LOGIN_USER, REGISTER_USER, LOGOUT_USER } from "../graphql/mutations";

interface UserContextType {
    user: any;
    login: (username: string, password: string) => Promise<boolean>;
    loginLoading: boolean;
    loginError: ApolloError | undefined;
    register: (username: string, password: string, email: string, navigate: Function) => Promise<void>;
    logout: () => Promise<void>;
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

    const client = useApolloClient();

    const {data: userData, loading: loadingUser, error: userError} = useQuery(GET_USER, {
        fetchPolicy: "network-only"
    });

    const [loginUser, {loading: loginLoading, error: loginError}] = useMutation(LOGIN_USER);

    const [registerUser, {loading: registerLoading, error: registerError}] = useMutation(REGISTER_USER);

    const [logoutUser] = useMutation(LOGOUT_USER, {
        refetchQueries: [{ query: GET_USER }],
        awaitRefetchQueries: true
    });

 async function login(username: string, password: string): Promise<boolean> {
    try {
        const { data } = await loginUser({
            variables: { username, password }
        });
        if (data?.loginUser) {
            setMessage("Login successful");
            return true; 
        } else {
            setMessage("Login Failed");
            return false;
        }
    } catch (err) {
        console.error("Login failed:", err);
        setMessage("Login Failed");
        return false;
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

    async function logout()
    {
        try {
            await logoutUser();
            //reset games so when a new user signs in it does not show the data from the old user
            client.cache.evict({fieldName: "getGames"});
            client.cache.gc();
            setMessage("Logout successful");
        } catch (err) {
            console.error("Logout failed:", err);
            setMessage("Logout Failed");
        }
    }

    return (
        <UserContext.Provider
            value={{
                user: userData?.getUser,
                login,
                register,
                logout,
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