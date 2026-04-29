import { POPULAR_GAMES } from "@/graphql/queries"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@apollo/client"

export const Home = () => {

    const {loading, error, data} = useQuery(POPULAR_GAMES);
    
    if(loading) return <p>Loading Games...</p>
    if (error) return <p>Error Loading Games: {error.message}</p>

    const games = data?.popularGames || [];


    return (
        <div className="min-h-screen w-full">
        
        <div className="px-8 pt-10 pb-6 border-b border-white/10">
            <h1 className="text-5xl font-bold text-white tracking-tight">
            Popular Games
            </h1>
        </div>

        <div className="px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {games.map((game: any) => (
                <Card
                key={game.id}
                className="bg-myBlack border border-white/20 rounded-lg overflow-hidden 
                            group cursor-pointer transition-all duration-200 
                            hover:border-white/60 hover:-translate-y-0.5 hover:shadow-xl"
                >
                <div className="w-full aspect-video overflow-hidden">
                    {game.background_image ? (
                    <img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-full object-cover transition-transform 
                                duration-300 group-hover:scale-105"
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/20 text-xs">No Image</span>
                    </div>
                    )}
                </div>

                <CardHeader className="px-4 py-3">
                    <CardTitle className="text-white text-sm font-semibold leading-snug 
                                        line-clamp-1 group-hover:text-white/80 transition-colors">
                    {game.name}
                    </CardTitle>
                    {game.rating > 0 && (
                    <p className="text-white/40 text-xs mt-1">
                        ★ {game.rating.toFixed(1)}
                    </p>
                    )}
                </CardHeader>
                </Card>
            ))}
            </div>
        </div>

        </div>
    )
}