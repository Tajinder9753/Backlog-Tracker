// src/components/GameGrid.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface GameGridProps {
  games: any[];
  title: string;
  accent?: string;
}

export const GameGrid = ({ games, title}: GameGridProps) => {
  const navigate = useNavigate();

  if (games.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-white font-semibold text-lg tracking-tight">{title}</h2>
        <span className="text-white/30 text-sm">{games.length}</span>
        <div className={`flex-1 h-px bg-white/10`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {games.map((game: any) => (
          <Card
            key={game.id}
            onClick={() => navigate(`/game/${game.rawgId}`)}
            className="bg-myBlack border border-white/10 rounded-lg overflow-hidden
                       group cursor-pointer transition-all duration-200
                       hover:border-white/30 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="w-full aspect-video overflow-hidden bg-white/5">
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
              <div className="flex items-center gap-2 mt-1">
                {game.rating > 0 && (
                  <p className="text-white/30 text-xs">★ {game.rating.toFixed(1)}</p>
                )}
                {game.myRating > 0 && (
                  <p className="text-yellow-400/80 text-xs">★ {game.myRating.toFixed(1)}</p>
                )}
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};