// src/components/GameGrid.tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const GAMES_PER_PAGE = 8;

interface GameGridProps {
  games: any[];
  title: string;
}

export const GameGrid = ({ games, title }: GameGridProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  if (games.length === 0) return null;

  const totalPages = Math.ceil(games.length / GAMES_PER_PAGE);
  const paginated = games.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE
  );

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <h2 className="text-white font-semibold text-lg tracking-tight">{title}</h2>
        <span className="text-white/30 text-sm">{games.length}</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paginated.map((game: any) => (
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

      {/* Pagination — only shows if more than one page */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>

            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={`cursor-pointer text-white hover:text-white hover:bg-white/10
                  ${currentPage === 1 ? "pointer-events-none opacity-30" : ""}`}
              />
            </PaginationItem>

            {getPageNumbers()[0] > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(1)}
                    className="cursor-pointer text-white hover:bg-white/10"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis className="text-white/40" />
                </PaginationItem>
              </>
            )}

            {getPageNumbers().map(page => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className={`cursor-pointer text-white hover:bg-white/10
                    ${currentPage === page ? "bg-white/20 border-white/20" : ""}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                <PaginationItem>
                  <PaginationEllipsis className="text-white/40" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(totalPages)}
                    className="cursor-pointer text-white hover:bg-white/10"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={`cursor-pointer text-white hover:text-white hover:bg-white/10
                  ${currentPage === totalPages ? "pointer-events-none opacity-30" : ""}`}
              />
            </PaginationItem>

          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};