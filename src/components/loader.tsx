import Skeleton from "react-loading-skeleton";

export function Loader({ width }: { width?: number }) {
    return <Skeleton baseColor="#02121D" highlightColor="#A9AF2C50" width={width ? width : 100} height={5} />
}