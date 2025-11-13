import Randomstring from "randomstring"

export function createRandomString() {
    const string = Randomstring.generate({
        length: 16,
        charset: ["alphanumeric", "!", "+", "-", "_", "(", ")"]
    })

    return string
}