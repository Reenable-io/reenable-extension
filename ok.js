let facescore = "240"
let pilescore = "60"
let commandescore = "300"

let pilepourcent = pilescore / commandescore * 100 + "%"
let facepourcent = facescore / commandescore * 100 + "%"



console.log(`face: ${facescore}, ${facepourcent}\npile: ${pilescore}, ${pilepourcent}\ncommmande: ${commandescore}`)