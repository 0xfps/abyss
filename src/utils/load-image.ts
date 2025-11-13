import { SVG_IMG_PREPEND } from "./constants";

export function loadImage(image: string): string {
    return `${SVG_IMG_PREPEND}${encodeURIComponent(image)}`
}