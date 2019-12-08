export default class Str{

    static capitalize(text){
        if(text && text.length>0 && typeof(text) === "string"){
            text = text.toLowerCase();
            let textArray = text.split("");

            textArray[0] = textArray[0].toUpperCase();
            return textArray.join("");
        }else{
            return text;
        }
    }
}