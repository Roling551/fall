import { Resource } from "./resource"

export type TextPartType = "string" | "emoticon"

export type TextPart = 
string |
{
    type: "emoticon",
    emoticon: Emoticon
}

export function getTextPartType(textPart: TextPart): TextPartType {
    if(typeof textPart === "string") {
        return "string"
    } else {
        return "emoticon"
    }
}


export type Emoticon = Resource

export function getEmoticonSource(part: TextPart) {
    if(typeof part != "object" || part["type"]!="emoticon") {
        return ``
    }
    return `assets/pictures/emoticons/${part.emoticon}.png`
}