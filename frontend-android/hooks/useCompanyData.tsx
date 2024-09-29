import {useContext, useEffect, useState} from "react";
import {getLikes, isAlreadyLiked, saveToStorage} from "../utils";
import JobDataContext from "../context/JobDataContext";

export default function useCompanyData(companyName: string) {
    const [isLiked, setIsLiked] = useState(false);
    const {data} = useContext(JobDataContext);

    useEffect(() => {
        isAlreadyLiked(companyName)
            .then((value) => {
                setIsLiked(value);
            })
            .catch((error) => {
                console.error("Error checking if company is liked:", error);
            });
    }, []);

    const updateData = async (data: string[]) => {
        try {
            await saveToStorage('companyLikes', JSON.stringify(data));
        } catch (error) {
            console.error("Error saving likes to storage:", error);
        }
    };

    const like = async () => {
        try {
            const likes = await getLikes();
            if (!likes.includes(companyName)) {
                likes.push(companyName);
                await updateData(likes);
            }
            setIsLiked(true);
        } catch (error) {
            console.error("Error liking company:", error);
        }
    };

    const unlike = async () => {
        try {
            const likes = await getLikes();
            const newLikes = likes.filter(name => name !== companyName);
            await updateData(newLikes);
            setIsLiked(false);
        } catch (error) {
            console.error("Error unliking company:", error);
        }
    };

    const toggleLike = async () => {
        try {
            if (isLiked) {
                await unlike();
            } else {
                await like();
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return {
        isLiked,
        toggleLike,
        jobs: data.filter((value) => value.Company === companyName)
    };
}
