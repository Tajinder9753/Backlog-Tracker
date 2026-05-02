import { Button } from "@/components/ui/button";
import { ADD_GAME, DELETE_GAME } from "@/graphql/mutations";
import { GAME_DETAILS } from "@/graphql/queries"
import { useUser } from "@/Hooks/useUser";
import { useMutation, useQuery } from "@apollo/client"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Rating from "@mui/material/Rating"
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const GameDetails = () => {
    const {user} = useUser();
    const {gameID} = useParams();
    const {loading, error, data} = useQuery(GAME_DETAILS, {variables: {gameID} })

    const [addGame] = useMutation(ADD_GAME, {
        refetchQueries: [{query: GAME_DETAILS, variables: {gameID}}]
    })
    const [deleteGame] = useMutation(DELETE_GAME, {
        refetchQueries: [{query: GAME_DETAILS, variables: {gameID}}]
    })

    const [gameAdded, setGameAdded] = useState(false);

    useEffect(() => {
        if (data?.gameDetails) {
            setGameAdded(data.gameDetails.owned ?? false);
        }
    }, [data])



    const [formData, setFormData] = useState({
    myRating: 0,
    status: '',
    review: '',
    owned: true,
    myPlatforms: []
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const handleRatingChange = (_: any, newValue: number | null) => {
        setFormData({
            ...formData,
            myRating: newValue ?? 0
        })
    }

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
            <div className="min-h-screen w-full">

            <div className="relative w-full h-105 overflow-hidden">
                <img
                src={data.gameDetails.background_image}
                alt={data.gameDetails.name}
                className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-myBlack via-myBlack/60 to-transparent" />

                <div className="absolute bottom-0 left-0 px-10 pb-8">
                <h1 className="text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                    {data.gameDetails.name}
                </h1>
                <p className="text-white/50 text-sm mt-2">{data.gameDetails.released}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col lg:flex-row gap-10">

                <div className="flex-1 flex flex-col gap-6">

                <div className="flex items-center gap-4">
                    <span className="text-white/40 text-xs uppercase tracking-widest">RAWG Rating</span>
                    <span className="text-white font-semibold text-lg">
                    ★ {data.gameDetails.rating.toFixed(1)}
                    </span>
                </div>

                <div
                    className="text-white/70 text-sm leading-relaxed
                            [&_p]:mb-3 [&_h2]:text-white [&_h2]:font-semibold [&_h2]:mt-4"
                    dangerouslySetInnerHTML={{ __html: data.gameDetails.description }}
                />

                {data.gameDetails.review && (
                    <div className="border-l-2 border-white/20 pl-4">
                    <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Your Review</p>
                    <p className="text-white/80 text-sm italic">{data.gameDetails.review}</p>
                    </div>
                )}
                </div>

                <div className="lg:w-72 flex flex-col gap-6">

                {user && (
                    <div className="flex gap-2">
                    {gameAdded ? (
                        <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={handleDeleteGame}
                        >
                        Remove from Backlog
                        </Button>
                    ) : (
                        <Button
                        className="flex-1"
                        onClick={handleAddGame}
                        >
                        Add to Backlog
                        </Button>
                    )}
                    {gameAdded && (
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="flex-1 border-white/10 text-white hover:bg-white/10">
                                     Edit
                                    </Button>                         
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Game Details</DialogTitle>
                                        <DialogDescription>
                                            Fill out any details you would like to update
                                        </DialogDescription>
                                    </DialogHeader>
                                    <FieldGroup>
                                        <Field>
                                            <Label htmlFor="myRating">Rating:</Label>
                                                <Rating
                                                    name="myRating"
                                                    defaultValue={data.gameDetails.myRating || null}
                                                    precision={0.5}
                                                    onChange={handleRatingChange}
                                                />
                                        </Field>
                                        <Field>
                                            <Label htmlFor="status">Status:</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={data.gameDetails.status || "Backlog"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup onChange={handleChange}>
                                                        <SelectItem value="Playing">Playing</SelectItem>
                                                        <SelectItem value="Backlog">Backlog</SelectItem>
                                                        <SelectItem value="Re-playing">Re-playing</SelectItem>
                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <FieldSet>
                                            <FieldLegend>Owned Platforms:</FieldLegend>
                                            <FieldGroup className="px-3">
                                                <Field orientation={"horizontal"}>
                                                    {data.gameDetails.platforms.map((p: any) => (
                                                        <div>
                                                            <Checkbox
                                                            key={p.platform.id}
                                                            name={p.platform.name}
                                                            value={p.platform}
                                                            >
                                                            </Checkbox>
                                                            <FieldLabel
                                                            htmlFor={p.platform.name}
                                                            >
                                                            {p.platform.name}
                                                            </FieldLabel>
                                                        </div>
                                                    ))}
                                                </Field>
                                            </FieldGroup>
                                        </FieldSet>
                                        <Field>
                                            <Label htmlFor="review"> Review: </Label>
                                            <Textarea 
                                            name="review" 
                                            placeholder="Type your review here"
                                            defaultValue={data.gameDetails.review || ""}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({
                                                ...formData,
                                                review: e.target.value
                                            })}/>
                                        </Field>
                                    </FieldGroup>
                                </DialogContent>
                            </form>
                        </Dialog>
                    )}
                    </div>
                )}

                {/* User Rating */}
                {data.gameDetails.myRating && (
                    <div className="bg-myLightBlack border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-widest text-white/40">Your Rating</p>
                    <Rating
                        name="half-rating"
                        defaultValue={data.gameDetails.myRating || null}
                        precision={0.5}
                        readOnly={true}
                    />
                    </div>
                )}

                {/* Genres */}
                <div className="bg-myLightBlack border border-white/10 rounded-lg p-4">
                    <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Genres</p>
                    <div className="flex flex-wrap gap-2">
                    {data.gameDetails.genres?.map((g: any) => (
                        <span
                        key={g.id}
                        className="text-xs text-white/70 bg-white/5 border border-white/10 
                                    rounded-full px-3 py-1"
                        >
                        {g.name}
                        </span>
                    ))}
                    </div>
                </div>

                {/* Platforms */}
                <div className="bg-myLightBlack border border-white/10 rounded-lg p-4">
                    <p className="text-xs uppercase tracking-widest text-white/40 mb-3">Platforms</p>
                    <div className="flex flex-col gap-1">
                    {data.gameDetails.platforms?.map((p: any) => (
                        <span key={p.platform.id} className="text-white/70 text-sm">
                        {p.platform.name}
                        </span>
                    ))}
                    </div>
                </div>

                {/* Owned Platforms */}
                {data.gameDetails.myPlatforms?.length > 0 && (
                    <div className="bg-myLightBlack border border-white/10 rounded-lg p-4">
                    <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
                        Your Platforms
                    </p>
                    <div className="flex flex-col gap-1">
                        {data.gameDetails.myPlatforms.map((p: any) => (
                        <span key={p.platform.id} className="text-white/70 text-sm">
                            {p.platform.name}
                        </span>
                        ))}
                    </div>
                    </div>
                )}

                {data.gameDetails.status && (
                    <div className="bg-myLightBlack border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                        <p className="text-xs uppercase tracking-widest text-white/40">Status</p>
                        <h2 className="text-white">{data.gameDetails.status}</h2>
                    </div>
                )}

                </div>
            </div>
            </div>
        </>
    )
}