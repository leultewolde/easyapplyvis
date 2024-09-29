import {loadFromStorage} from "./storage";

export const getLikes = async () => {
    try {
        const data = await loadFromStorage('companyLikes');
        if (data) {
            const likes: string[] = JSON.parse(data);
            return likes;
        }
        return [];
    } catch (error) {
        console.error("Error loading likes from storage:", error);
        return [];
    }
};

export const isAlreadyLiked = async (companyName: string) => {
    try {
        const likes = await getLikes();
        return likes.includes(companyName);
    } catch (error) {
        console.error("Error checking likes:", error);
        return false;
    }
};