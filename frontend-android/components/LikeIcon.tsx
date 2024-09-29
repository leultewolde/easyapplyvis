import Icon from 'react-native-vector-icons/Ionicons'
import {TouchableOpacity} from "react-native";

interface LikeIconProps {
    size: number;
    isLiked: boolean;
    onPress: () => void;
}

export default function LikeIcon({size, isLiked, onPress}: LikeIconProps) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon name={isLiked ? "heart" : "heart-outline"} size={size}/>
        </TouchableOpacity>
    );
}