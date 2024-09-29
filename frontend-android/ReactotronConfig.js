import Reactotron, {storybook} from "reactotron-react-native";

Reactotron.configure({
    name: "React Native Demo",
  })
  .useReactNative({
    storybook: true,
  })
  .connect();