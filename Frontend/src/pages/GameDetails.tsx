import { Button } from "@/components/ui/button";
import { ADD_GAME } from "@/graphql/mutations";
import { GAME_DETAILS } from "@/graphql/queries"
import { useMutation, useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"

export const GameDetails = () => {
    const {gameID} = useParams();
    const {loading, error, data} = useQuery(GAME_DETAILS, {variables: {gameID} })

    const [addGame] = useMutation(ADD_GAME)

    const handleAddGame = async() => {
        const input = {
            rawgId: gameID,
            name: data.gameDetails.name,
            description: data.gameDetails.description,
            background_image: data.gameDetails.background_image,
            released: data.gameDetails.released,
            platforms: [],
            myPlatforms: [],
            genres: [],
            myRating: 3.0,
            review: "This is a good game",
            status: "Playing",
            owned: true

        };

        await addGame({
            variables: {input}
        })
    }

    if (loading) return <p className="text-white">Loading Game...</p>
    if (error) return <p className="text-white">Error Loading Game: {error.message}</p>
    return (
        <>
            <div>
                <h1 className="text-white text-5xl py-10">{data.gameDetails.name}</h1>
                <img src = {data.gameDetails.background_image} alt={data.gameDetails.name}></img>
                <p className="text-white">{data.gameDetails.description}</p>
                <p className="text-white">{data.gameDetails.rating.toFixed(1)}</p>
                {data.gameDetails.myRating && (
                    <p className="text-white">{data.gameDetails.myRating.toFixed(1)}</p>
                )}
                <p className="text-white">{data.gameDetails.released}</p>
                <div>
                    <h2 className="text-white">Platforms</h2>
                    <ul>
                        {data.gameDetails.platforms?.map((p: any) => (
                        <li key={p.platform.id} className="text-white">
                            {p.platform.name}
                        </li>
                        ))}
                    </ul>
                </div>
                {data.gameDetails.myPlatforms && (
                    <div>
                        <h2 className="text-white">Platforms</h2>
                        <ul>
                            {data.gameDetails.platforms?.map((p: any) => (
                            <li key={p.platform.id} className="text-white">
                                {p.platform.name}
                            </li>
                            ))}
                        </ul>
                </div>
                )}
                <div>
                    <h2 className="text-white">Genres</h2>
                    <ul>
                        {data.gameDetails.genres?.map((g: any) => (
                        <li key={g.id} className="text-white">
                            {g.name}
                        </li>
                        ))}
                    </ul>
                </div>
                {data.gameDetails.review && (
                    <p className="text-white">{data.gameDetails.review}</p>
                )}
                {data.gameDetails.owned ? <Button className="text-white" variant={"destructive"}>Remove Game</Button> : <Button className="text-white" onClick={handleAddGame}>Add Game</Button>}
            </div>
        </>
    )
}