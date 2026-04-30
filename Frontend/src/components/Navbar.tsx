import { useUser } from "@/Hooks/useUser";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

export const Navbar = () => {
    const {user, logout, setMessage} = useUser();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        setTimeout(()=> {
            setMessage("");
             navigate("/login");
        }, 1000);
    }

    return (
        <div className="bg-myTurquoise/40 backdrop-blur-sm border-b border-border">
            <nav className="mx-auto px-6 h-16 flex items-center justify-between gap-4">
                
                {/* Left — Logo */}
                <div className="shrink-0">
                <h1 className="text-white font-bold tracking-tight text-lg cursor-pointer"
                    onClick={() => navigate("/")}>
                    Backlog Tracker
                </h1>
                </div>

                {/* Center — Search */}
                <div className="flex-1 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
                    <input
                    type="text"
                    placeholder="Search games..."
                    className="w-full bg-white/10 border border-white/10 rounded-md 
                                pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40
                                focus:outline-none focus:border-white/30 focus:bg-white/15
                                transition-all duration-200"
                    />
                </div>
                </div>

                {/* Right — Auth buttons */}
                <div className="flex items-center gap-1 shrink-0">
                {!user ? (
                    <>
                    <Button variant="ghost" className="text-white" onClick={() => navigate("/login")}>
                        Login
                    </Button>
                    <Button variant="ghost" className="text-white" onClick={() => navigate("/register")}>
                        Register
                    </Button>
                    </>
                ) : (
                    <>
                    <Button variant="ghost" className="text-white" onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                        Logout
                    </Button>
                    </>
                )}
                </div>

            </nav>
        </div>
    )
}
