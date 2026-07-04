//---- ---- ---- ---- html functions

//getElementbyID but shorter
function POwO_docgetel(InString)
{
    return document.getElementById(InString);
}

//---- ---- ---- ---- math functions

//math clamping
function POwO_Math_Clamp(InMin, InVal, InMax)
{
    
    //return Math.max(InMin, Math.min(InVal, InMax) );
    if (InVal > InMax)
    {
        return InMax;
    }
    else if (InVal < InMin)
    {
        return InMin;
    }
    else
    {
        return InVal;
    }

}

function POWO_Math_Lerp(A, B, t)
{
    return ( B - A ) * t + A
}

function POwO_Math_IsInRange_Exclusive(inMin, inVal, inMax)
{
    return inMin < inVal && inVal < inMax
}




// ---- ---- ---- ---- SETUP

class TextNOwOde
{
    constructor(inText, inPosX, inPosY, inVel, inWidthMargin, inHeight, inFont, inFontToWidthRatio, inFillColor, inTextColor, inEffect)
    {
        this.text = inText
        this.posX = inPosX
        this.posY = inPosY
        this.vel = inVel

        this.widthMargin = inWidthMargin
        this.width = inWidthMargin * 2 + inText.length * inFontToWidthRatio
        this.height = inHeight

        this.font = inFont
        this.fontToWidthRatio = inFontToWidthRatio

        this.colorFill = inFillColor
        this.colorText = inTextColor

        this.effect = inEffect //❤ = HP add, ⏳ = time add duration, 🐌 = slow nodes
    }

    updateW()
    {
        this.width = this.widthMargin * 2 + this.text.length * this.fontToWidthRatio
    }

    move ()
    {
        this.posY += this.vel
    }

    drawMe ()
    {
        this.updateW();

        //first the tag
        ctx.beginPath()
        ctx.fillStyle = this.colorFill
        ctx.roundRect( this.posX - this.width / 2 , this.posY - this.height/2 , this.width, this.height, 16 )
        ctx.fill()

        //then the text
        ctx.font = this.font
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = this.colorText
        ctx.fillText(this.text, this.posX, this.posY)
    }
}

class hOwOrglass
{
    constructor(inFullmin, inFullmax, inCurr)
    {
        this.fullMin = inFullmin
        this.fullMax = inFullmax
        this.cur = inCurr
    }

    drain()
    {
        if (this.cur > 0)
        {
            this.cur -= 1
            return false
        }
        else
        {
            this.cur = POWO_Math_Lerp( this.fullMin, this.fullMax, Math.random() )
            return true
        }
    }
}

const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");
const HTML_Body = POwO_docgetel("HTML_body")

var GLOBAL_PromptArray = []
var GLOBAL_GroundLine = 900
var GLOBAL_UserTextNode = new TextNOwOde("", ctx.canvas.width / 2 , GLOBAL_GroundLine + 100, 0, 25, 100, "72px Calibri", 29, "rgba(255,192,0,0.25)","rgba(255,192,0,1)")

var GLOBAL_Diff = 0 //0~15, each 1min30sec
var GLOBAL_Score = 0
var GLOBAL_Goal = 100
var GLOBAL_HP = 50 //each character is 1HP
var GLOBAL_Hourglass = new hOwOrglass(500, 1500, 0)

var GLOBAL_Pocket_TimeAdd = 0
var GLOBAL_Pocket_NodeSlow = 0


const GLOBAL_Dictionary_Response = await fetch("./Dictionary-main.txt")
const GLOBAL_Dictionaey_WholeString = (await GLOBAL_Dictionary_Response.text()).split(/\r?\n/)
var GLOBAL_Dictionary_Main = [ [],[],[],[], [],[],[],[], [],[],[],[], [],[],[],[] ]
for(let i = 0 ; i < GLOBAL_Dictionaey_WholeString.length ; i++)
{
    let temp_currentString = GLOBAL_Dictionaey_WholeString[i] 
    let temp_currentStringLength = temp_currentString.length

    if (0 < temp_currentStringLength && temp_currentStringLength < 16)
    {
        GLOBAL_Dictionary_Main[ temp_currentStringLength - 1 ].push( temp_currentString )
    }
    else
    {
        GLOBAL_Dictionary_Main[10].push( temp_currentString )
    }
}
console.log(GLOBAL_Dictionary_Main)


var GLOBAL_Dictionary = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","t","s","u","v","w","x","y","z"]

/*

level 0 : 1 & 2 
level 1 : 2 & 3
level 2 : 3 & 4 & 5
level 3 : 4 & 5 & 6
level 4 : 5 & 6
level 5 : 7 & 8
level 6 : 9 & 10
level 7 : memes

*/




// ---- ---- ---- ---- page function

function POwO_Dictionary_GeneratePrompt()
{
    //base pm the current difficulty, which word list should we choose from the dictionary ?
    let temp_Table_fromDiffToIndex = 
    [
        [0,1,1,2,2,2],
        [2,2,3,3,3,4,4],
        [4,4,5,5,5,6,6],
        [4,5,5,5,6,6,6,7,8],

        [5,5,6,6,6,7,7,7,8,9,10],
        [5,5,6,6,6,7,7,7,8,8,9,10,11,12],
        [5,5,6,6,6,7,7,7,8,8,8,9,9,10,11,12,13,14],
        [15]
    ]

    let temp_GrabIndex = temp_Table_fromDiffToIndex[ GLOBAL_Diff ][ Math.floor(Math.random() * temp_Table_fromDiffToIndex[GLOBAL_Diff].length) ]

    return GLOBAL_Dictionary_Main[ temp_GrabIndex ][ Math.floor(Math.random() * GLOBAL_Dictionary_Main[ temp_GrabIndex ].length) ]
}


function POwO_RedrawAll()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw status
    let temp_StatusTag_X = 50
    let temp_StatusTag_Y = 50
    ctx.font = "30px Calibri"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#ffffff"
    ctx.fillText("🚀 : " + GLOBAL_Score.toString() + "/" + GLOBAL_Goal.toString(), temp_StatusTag_X, temp_StatusTag_Y * 1)
    ctx.fillText("❤ : " + GLOBAL_HP.toString(), temp_StatusTag_X, temp_StatusTag_Y * 2)
    ctx.fillText("⏳ : " + GLOBAL_Pocket_TimeAdd.toString(), temp_StatusTag_X, temp_StatusTag_Y * 3)
    ctx.fillText("🐌 : " + GLOBAL_Pocket_NodeSlow.toString(), temp_StatusTag_X, temp_StatusTag_Y * 4)

    //draw all prompts
    for(let i = 0 ; i < GLOBAL_PromptArray.length ; i++)
    {
        GLOBAL_PromptArray[i].drawMe()
    }

    //draw the ground line
    ctx.beginPath()
    ctx.setLineDash([10,10])
    ctx.moveTo(0, GLOBAL_GroundLine)
    ctx.lineTo(1920, GLOBAL_GroundLine)
    ctx.strokeStyle = "#FF0000"
    ctx.lineWidth =  2
    ctx.stroke()

    //draw player text
    GLOBAL_UserTextNode.drawMe()
}



window.addEventListener("message",(event) => {
    
})


window.addEventListener("keydown",(event) => {

    if (event.key === "Enter")
    {
        let temp_userText = GLOBAL_UserTextNode.text

        for(let i = GLOBAL_PromptArray.length - 1 ; 0 <= i ; i--)
        {
            if (GLOBAL_PromptArray[i].text === temp_userText)
            {
                let temp_currentNode = GLOBAL_PromptArray[i]

                //add score
                GLOBAL_Score += temp_userText.length

                //effects ?
                switch (temp_currentNode.effect) {
                    case "❤" : GLOBAL_HP += temp_currentNode.text.length ; break ;
                    case "⏳" : GLOBAL_Pocket_TimeAdd ++ ; break;
                    case "🐌" : GLOBAL_Pocket_NodeSlow ++ ; break ;
                    default : break ;
                }

                //delete node
                GLOBAL_PromptArray.splice(i,1)
            }
        }


        GLOBAL_UserTextNode.text = ""
    }
    else if (event.key === "Backspace")
    {
        GLOBAL_UserTextNode.text = GLOBAL_UserTextNode.text.slice(0,-1)
    }
    else if (event.key === "Shift" || event.key === "Control")
    {
        //ignore
    }
    else
    {
        GLOBAL_UserTextNode.text += event.key
    }
})


// ---- ---- ---- ---- RUN MAIN

POwO_RedrawAll()

setInterval(()=>{

    //drop all prompts
    for(let i = 0 ; i < GLOBAL_PromptArray.length ; i++)
    {
        GLOBAL_PromptArray[i].move()

        if (GLOBAL_PromptArray[i].posY > GLOBAL_GroundLine)
        {
            GLOBAL_PromptArray.splice(i,1)
        }
    }

    //drain hourglass
    let FLAG_makeNewWords = GLOBAL_Hourglass.drain()
    if ( FLAG_makeNewWords )
    {
        //generate new words
        GLOBAL_PromptArray.push
        (
            new TextNOwOde
            (
                POwO_Dictionary_GeneratePrompt(),
                Math.random() * ctx.canvas.width,
                0,
                Math.random(), //drop velocity
                50,
                80,
                "50px Calibri",
                12,
                "rgba(32,32,32,0.5)",
                "rgba(255,255,255,1)"
            )
        )
    }

    POwO_RedrawAll()
},1)

