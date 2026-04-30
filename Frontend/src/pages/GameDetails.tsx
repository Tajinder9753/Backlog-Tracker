import { Button } from "@/components/ui/button";
import { ADD_GAME, DELETE_GAME } from "@/graphql/mutations";
import { GAME_DETAILS } from "@/graphql/queries"
import { useUser } from "@/Hooks/useUser";
import { useMutation, useQuery } from "@apollo/client"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export const GameDetails = () => {
    const {user} = useUser();
    const {gameID} = useParams();
    const {loading, error, data} = useQuery(GAME_DETAILS, {variables: {gameID} })

    const [addGame] = useMutation(ADD_GAME)
    const [deleteGame] = useMutation(DELETE_GAME)

    const [gameAdded, setGameAdded] = useState(false);

    useEffect(() => {
        if (data?.gameDetails) {
            setGameAdded(data.gameDetails.owned ?? false);
        }
    }, [data])

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

        try {
            await addGame({
            variables: {input}
        })
        setGameAdded(true);
        } catch (err) {
            console.log(err);
        }

    }

    const handleDeleteGame = async () => {
        const id = data.gameDetails.mongoId;
        try{
            await deleteGame({
                variables: {id}
            })

            setGameAdded(false);
        } catch (err) {
            console.log(err);
        }
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
                {user && (
                    gameAdded ? <Button className="text-white" variant={"destructive"} onClick={handleDeleteGame}>Remove Game</Button> : <Button className="text-white" onClick={handleAddGame}>Add Game</Button>
                )}
            </div>
        </>
    )
}