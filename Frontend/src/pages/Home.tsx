import { POPULAR_GAMES } from "@/graphql/queries"
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@apollo/client"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { useEffect, useState } from "react";
import { useUser } from "@/Hooks/useUser";
import { useNavigate } from "react-router-dom";

const TOTAL_PAGES = 50;

export const Home = () => {

  const navigate = useNavigate();
    const {user} = useUser();

  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data } = useQuery(POPULAR_GAMES, {
    variables: { pageNumber: currentPage },
  });

  const games = data?.popularGames ?? [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const getPageNumbers = () => {
    if (TOTAL_PAGES <= 5) return Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= TOTAL_PAGES - 2) return [TOTAL_PAGES - 4, TOTAL_PAGES - 3, TOTAL_PAGES - 2, TOTAL_PAGES - 1, TOTAL_PAGES];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="min-h-screen w-full">

      <div className="px-8 pt-10 pb-6 border-b border-white/10">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Popular Games
        </h1>
      </div>

      <div className="px-8 py-8">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-myBlack border border-white/10 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="w-full aspect-video bg-white/10" />
                <div className="px-4 py-3 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center justify-center h-64">
            <p className="text-white/40 text-sm">Failed to load games. Please try again.</p>
          </div>
        )}

        {/* Games Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {games.map((game: any) => (
              <Card
                key={game.id}
                className="bg-myBlack border border-white/20 rounded-lg overflow-hidden
                           group cursor-pointer transition-all duration-200
                           hover:border-white/60 hover:-translate-y-0.5 hover:shadow-xl"
                onClick={() => navigate(`/game/${game.id}`)}
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

                  {user && game.myRating && (
                    <p className="text-yellow-500/80 text-xs mt-1">
                        ★ {game.myRating.toFixed(1)}
                    </p>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && (
          <div className="mt-10">
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

                {getPageNumbers()[getPageNumbers().length - 1] < TOTAL_PAGES && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis className="text-white/40" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setCurrentPage(TOTAL_PAGES)}
                        className="cursor-pointer text-white hover:bg-white/10"
                      >
                        {TOTAL_PAGES}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(TOTAL_PAGES, p + 1))}
                    className={`cursor-pointer text-white hover:text-white hover:bg-white/10
                      ${currentPage === TOTAL_PAGES ? "pointer-events-none opacity-30" : ""}`}
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </div>
        )}

      </div>
    </div>
  );
};