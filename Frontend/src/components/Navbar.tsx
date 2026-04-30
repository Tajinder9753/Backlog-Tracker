import { useUser } from "@/Hooks/useUser";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_GAME } from "@/graphql/queries";

export const Navbar = () => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const [searchGames, {data, loading}] = useLazyQuery(SEARCH_GAME);

    useEffect(() => {
        if (query.length < 2) { setIsOpen(false); return;}

        const timeout = setTimeout(async () => {
          searchGames({variables: {name: query}})
          setIsOpen(true);
        }, 400)

        return () => clearTimeout(timeout);
    }, [query]);

    const {user, logout, setMessage} = useUser();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        setTimeout(()=> {
            setMessage("");
             navigate("/login");
        }, 1000);
    }

    const results = data?.searchGame ?? [];

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
                        <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={()=> setTimeout(() => setIsOpen(false), 200)}
                        onFocus={() => results.length > 0 && setIsOpen(true)}
                        placeholder="Search games..."
                        className="w-full bg-white/10 border border-white/10 rounded-md 
                                    pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40
                                    focus:outline-none focus:border-white/30 focus:bg-white/15
                                    transition-all duration-200"
                        />
                    </div>
                    {isOpen && (
                        <div className="absolute top-full mt-1 w-full bg-myLightBlack border
                        border-white/10 rounded-md shadow-xl z-50 overflow-hidden">
                        {loading && (
                            <div className="px-4 py-3 text-white/40 text-sm">Searching...</div>
                        )}

                        {!loading && results.length === 0 && (
                            <div className="px-4 py-3 text-white/40 text-sm">No results found</div>
                        )}

                        {!loading && results.map((game: any) => (
                            <div
                            key={game.id}
                            onClick={() => {
                                navigate(`/game/${game.id}`);
                                setQuery("");
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5
                                        cursor-pointer transition-colors border-b border-white/5 last:border-0"
                            >
                            {game.background_image ? (
                                <img
                                src={game.background_image}
                                alt={game.name}
                                className="w-10 h-10 rounded object-cover shrink-0"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded bg-white/10 shrink-0" />
                            )}
                            <span className="text-white text-sm truncate">{game.name}</span>
                            </div>
                        ))}
                        </div>
                    )}
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
