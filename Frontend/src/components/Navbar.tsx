import { useUser } from "@/Hooks/useUser";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export const Navbar = () => {
    const {user, logout} = useUser();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
    }

    return (
        <div className=" bg-blue-200/60 backdrop-blur-sm border-b border-border">
            <nav  className="max-w-5xl mx-auto px-6 h-16 flex items-center">
                {!user ? (
                    <>
                    <Button variant="ghost" onClick={() => navigate("/login")}>
                        Login
                    </Button>
                    <Button variant="ghost" onClick={() => navigate("/register")}>
                        Register
                    </Button>
                    </>
                ) : (
                    <>
                    <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                        Logout
                    </Button>
                    </>
                )}
            </nav>
        </div>

    )
}
