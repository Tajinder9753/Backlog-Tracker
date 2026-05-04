import { GET_MY_GAMES } from "@/graphql/queries"
import { useUser } from "@/Hooks/useUser"
import { useQuery } from "@apollo/client"
import { GameGrid } from "@/components/GameGrid"
import Footer from "@/components/Footer"

export const Dashboard = () => {
    const {user} = useUser()
    const {loading, error, data} = useQuery(GET_MY_GAMES)

    const games = data?.getGames ?? [];

    const playing = games.filter((g:any) => g.status == "Playing");
    const replaying = games.filter((g:any) => g.status == "Re-playing");
    const backlog = games.filter((g:any) => g.status == "Backlog");
    const completed = games.filter((g:any) => g.status == "Completed");

    if (loading) return <p>Loading....</p>
    if (error) return <p>error: {error.message}</p>
return (
  <div className="min-h-screen w-full">

    {/* Header */}
    <div className="px-8 pt-10 pb-6 border-b border-white/10">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-1">
        Your Library
      </p>
      <h1 className="text-4xl font-bold text-white tracking-tight">
        Welcome back, {user.username}
      </h1>
      <div className="flex gap-6 mt-4">
        <p className="text-white/40 text-sm">{games.length} <span className="text-white/20">games</span></p>
        <p className="text-white/40 text-sm">{completed.length} <span className="text-white/20">completed</span></p>
        <p className="text-white/40 text-sm">{playing.length} <span className="text-white/20">playing</span></p>
      </div>
    </div>

    {/* Sections */}
    <div className="px-8 py-8 flex flex-col gap-12">
      <GameGrid title="Playing" games={playing} />
      <GameGrid title="Re-playing" games={replaying} />
      <GameGrid title="Backlog" games={backlog} />
      <GameGrid title="Completed" games={completed} />

      {games.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <p className="text-white/20 text-sm">Your backlog is empty</p>
          <p className="text-white/10 text-xs">Search for games to get started</p>
        </div>
      )}
    </div>
      <Footer />
  </div>
);
}