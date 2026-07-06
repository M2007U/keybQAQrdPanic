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

//---- ---- ---- ---- helping functions

function POwO_JS_ArrayRandomPickOne(inArray)
{
    return inArray[ Math.floor(Math.random() * inArray.length) ]
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
        this.width = this.widthMargin * 2 + (this.text.length + this.effect.length) * this.fontToWidthRatio
    }

    move ()
    {
        this.posY += this.vel
    }

    drawMe ()
    {
        this.updateW();
        ctx.lineWidth = 0
        ctx.strokeWidth = 0
        ctx.setLineDash([])

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
        ctx.fillText(this.text + this.effect, this.posX, this.posY)
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
var GLOBAL_GroundLine = 800
var GLOBAL_UserTextNode = new TextNOwOde("", ctx.canvas.width / 2 , GLOBAL_GroundLine + 100, 0, 25, 100, "72px Consolas", 40, "rgba(255,192,0,0.25)","rgba(255,192,0,1)","")
var GLOBAL_canvasWidthMargin = 200

var GLOBAL_gameState = "stand by"
var GLOBAL_Diff = 0 //0~15, each 1min30sec
var GLOBAL_Score = 0
var GLOBAL_Goal = [ 50, 75, 100, 100, 125, 125, 150, 200 ]
var GLOBAL_HP = 50 //each character is 1HP
var GLOBAL_Hourglass = new hOwOrglass(1000, 3000, 0)

var GLOBAL_Pocket_TimeAdd = 0
var GLOBAL_Pocket_NodeSlow = 0
var GLOBAL_Pocket_NodeBomb = 0

const GLOBAL_Dictionary_Response = await fetch("./Dictionary-Main.txt")
const GLOBAL_Dictionary_WholeString = (await GLOBAL_Dictionary_Response.text()).split(/\r?\n/)
var GLOBAL_Dictionary_Main = [ [],[],[],[], [],[],[],[], [],[],[],[], [],[],[],[] ]
for(let i = 0 ; i < GLOBAL_Dictionary_WholeString.length ; i++)
{
    let temp_currentString = GLOBAL_Dictionary_WholeString[i] 
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
    //wordLengthDistribution : how long the world should be ? = l
    //wordQuantityDistribution : how many words for this wave ? = q
    let temp_Table_fromDiffToIndex = 
    [
        {l : [0,1,1,2,2,2],                                 q : [3,4,5]},
        {l : [2,2,3,3,3,4,4],                               q : [3,4,5,5]},
        {l : [4,4,5,5,5,6,6],                               q : [3,4,4,5]},
        {l : [4,5,5,5,6,6,6,7,8],                           q : [3,4,5]},

        {l : [5,5,6,6,6,7,7,7,8,9,10],                      q : [2,3,4]},
        {l : [5,5,6,6,6,7,7,7,8,8,9,10,11,12],              q : [2,3,3,4] },
        {l : [5,5,6,6,6,7,7,7,8,8,8,9,9,10,11,12,13,14],    q : [1,2,2,3,3]},
        {l : [15],                                          q : [1]}
    ]

    let temp_currentSelectedObject = temp_Table_fromDiffToIndex[ GLOBAL_Diff ]
    let temp_selected_wordQuantity = POwO_JS_ArrayRandomPickOne(temp_currentSelectedObject.q)
    let temp_returnString = ""
    for(let i = 0 ; i < temp_selected_wordQuantity ; i++)
    {
        let temp_selected_diffIndex = POwO_JS_ArrayRandomPickOne(temp_currentSelectedObject.l) //decide world length
        temp_returnString += POwO_JS_ArrayRandomPickOne(GLOBAL_Dictionary_Main[ temp_selected_diffIndex ])
        if (i < temp_selected_wordQuantity - 1){temp_returnString += " "}
    }

    return temp_returnString
}


function POwO_RedrawAll()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //draw status
    let temp_StatusTag_Y = 40
    ctx.font = "25px Consolas"
    ctx.textAlign = "left"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "#ffffff"
    let temp_StatusTag_items_Left = 
    [
        "⏱️ : " + Math.floor(GLOBAL_Hourglass.cur) ,
        "🚀 : " + GLOBAL_Score.toString() + "/" + GLOBAL_Goal[Math.min(GLOBAL_Diff,7)].toString() + " , " + GLOBAL_Diff.toString() + "/8",
        "❤  : " + GLOBAL_HP.toString()
    ]
    for(let i = temp_StatusTag_items_Left.length-1 ; 0 <= i ; i--)
    {
        ctx.fillText(temp_StatusTag_items_Left[i], 50, GLOBAL_GroundLine + 50 + temp_StatusTag_Y * i)
    }
    let temp_StatusTag_items_Right =
    [
        "⏳ : " + GLOBAL_Pocket_TimeAdd.toString() + " </ht>",
        "🐌 : " + GLOBAL_Pocket_NodeSlow.toString() + " </hs>",
        "💥 : " + GLOBAL_Pocket_NodeBomb.toString() + " </hb>"
    ]
    for(let i = temp_StatusTag_items_Right.length-1 ; 0 <= i ; i--)
    {
        ctx.fillText(temp_StatusTag_items_Right[i], ctx.canvas.width - 200, GLOBAL_GroundLine + 50 + temp_StatusTag_Y * i)
    }
    

    //draw game states
    ctx.font = "250px Consolas"
    ctx.textAlign = "center"
    ctx.fillStyle = "rgba(255,255,255,0.125)"
    let temp_stateText = ""
    switch (GLOBAL_gameState)
    {
        case "pause" : temp_stateText = "PAUSED" ; break ;
        case "player win" : temp_stateText = "\\(OwO)/" ; break ;
        case "player lose" : temp_stateText = "(QAQ)" ; break ;
        case "stand by" : temp_stateText = "</play>" ; break ;
        default: break;
    }
    ctx.fillText(temp_stateText , ctx.canvas.width / 2 , 450)

    //draw all prompts and potential matches
    for(let i = 0 ; i < GLOBAL_PromptArray.length ; i++)
    {
        let temp_currentTextNode = GLOBAL_PromptArray[i]
        if (temp_currentTextNode.text === GLOBAL_UserTextNode.text)
        {
            ctx.beginPath()
            ctx.setLineDash([10,10])
            ctx.lineWidth =  2
            ctx.moveTo(temp_currentTextNode.posX , temp_currentTextNode.posY)
            ctx.lineTo(GLOBAL_UserTextNode.posX , GLOBAL_UserTextNode.posY)
            ctx.strokeStyle = "#FFC000"
            ctx.stroke()
        }

        GLOBAL_PromptArray[i].drawMe()
    }

    //draw the ground line
    ctx.beginPath()
    ctx.setLineDash([10,10])
    ctx.lineWidth =  2
    ctx.moveTo(0, GLOBAL_GroundLine)
    ctx.lineTo(1920, GLOBAL_GroundLine)
    ctx.strokeStyle = "#FF0000"
    ctx.stroke()

    //draw player text
    ctx.setLineDash([])
    GLOBAL_UserTextNode.drawMe()
}






// ---- ---- ---- ---- RUN MAIN

POwO_RedrawAll()

function POwO_Interval_Tick()
{
    //drop all prompts
    for(let i = 0 ; i < GLOBAL_PromptArray.length ; i++)
    {
        GLOBAL_PromptArray[i].move()

        //when it hits the ground
        if (GLOBAL_PromptArray[i].posY > GLOBAL_GroundLine)
        {
            GLOBAL_HP -= GLOBAL_PromptArray[i].text.length
            GLOBAL_PromptArray.splice(i,1)
            
            //if damage too much
            if (GLOBAL_HP < 0)
            {
                console.log("player lose")
                GLOBAL_gameState = "player lose"
                clearInterval(GLOBAL_Interval_Run)
                POwO_RedrawAll()
            }
        }
    }

    //drain hourglass
    let FLAG_makeNewWords = GLOBAL_Hourglass.drain()
    if ( FLAG_makeNewWords )
    {
        //generate new words

        let temp_String_Array = POwO_Dictionary_GeneratePrompt().split(" ")

        for(let i = 0 ; i < temp_String_Array.length ; i++)
        {
            let temp_makeNode_text = temp_String_Array[i];

            let temp_makeNode_PosX = -1;
            if (temp_String_Array.length > 1)
            {
                temp_makeNode_PosX = POWO_Math_Lerp(GLOBAL_canvasWidthMargin, ctx.canvas.width - GLOBAL_canvasWidthMargin, i / (temp_String_Array.length - 1))
            }
            else
            {
                temp_makeNode_PosX = POWO_Math_Lerp(GLOBAL_canvasWidthMargin, ctx.canvas.width - GLOBAL_canvasWidthMargin, Math.random() )
            }

            let temp_makeNode_vel = 0;
            if (1 <= temp_makeNode_text.length && temp_makeNode_text.length <= 4){temp_makeNode_vel = 0.4;}
            else if (5 <= temp_makeNode_text.length && temp_makeNode_text.length <= 10){temp_makeNode_vel = 0.2;}
            else if (11 <= temp_makeNode_text.length){temp_makeNode_vel = 0.1;}

            let temp_makeNode_effect_pool = ["","","","","","","","","","","","","","❤","⏳","🐌","💥"]
            //❤ = HP add, ⏳ = time add duration, 🐌 = slow nodes, 💥 = destroy 5 nodes
            let temp_makeNode_effect = POwO_JS_ArrayRandomPickOne(temp_makeNode_effect_pool)
            
            let temp_makeNode_fillColor = "rgba(32,32,32,0.5)"
            let temp_makeNode_textColor = "rgba(255,255,255,1)"
            if (temp_makeNode_effect.length > 0)
            {
                temp_makeNode_fillColor = "rgba(0,255,128,0.5)"
                temp_makeNode_textColor = "rgba(0,192,64,1)"
            }

            GLOBAL_PromptArray.push
            (
                new TextNOwOde
                (
                    temp_makeNode_text, //inText
                    temp_makeNode_PosX, //inPosX
                    0 - Math.random() * 100 , //inPosY
                    temp_makeNode_vel, //inVel
                    50, //widthMargin
                    80, //height
                    "50px Consolas", //inFont
                    12, //inFontToWidthRatio
                    temp_makeNode_fillColor, //inFillColor
                    temp_makeNode_textColor, //inTextColor
                    temp_makeNode_effect
                )
            )
        }
    }
    POwO_RedrawAll()
}

window.addEventListener("message",(event) => {
    
})


window.addEventListener("keydown",(event) => {

    if (event.key === "Enter" || event.key === " ")
    {
        event.preventDefault();
        let temp_userText = GLOBAL_UserTextNode.text

        if (temp_userText.at(0) === '/')
        {
            //it is a special command
            switch (temp_userText)
            {
                case "/play" :
                    if (GLOBAL_gameState !== "play")
                    {
                        GLOBAL_Interval_Run = setInterval(()=>{ POwO_Interval_Tick() },1) ;
                        GLOBAL_gameState = "play" ;
                    }
                break ;
                case "/pause" :
                    if (GLOBAL_gameState === "play")
                    {
                        clearInterval(GLOBAL_Interval_Run) ;
                        GLOBAL_gameState = "pause" ;
                        POwO_RedrawAll() ;
                    }
                break ;
                case "/ht" :
                    if (GLOBAL_Pocket_TimeAdd > 0)
                    {
                        GLOBAL_Hourglass.cur += 1000 ;
                        GLOBAL_Pocket_TimeAdd --
                    }
                break ;
                case "/hs" :
                    if (GLOBAL_Pocket_NodeSlow > 0)
                    {
                        for(let i = 0 ; i < GLOBAL_PromptArray.length ; i++)
                        {
                            GLOBAL_PromptArray[i].vel /= 2
                        }
                        GLOBAL_Pocket_NodeSlow --
                    }
                break ;
                case "/hb" :
                    if (GLOBAL_Pocket_NodeBomb > 0)
                    {
                        GLOBAL_PromptArray.sort((a,b)=>{a.posY-b.posY}) ;
                        for(let i = 0 ; i < 5 ; i++)
                        {
                            if (GLOBAL_PromptArray.length > 0)
                            {
                                GLOBAL_PromptArray.shift()
                            }
                        }
                    }
                    GLOBAL_Pocket_NodeBomb --
                break;
            
                default: break ;
            }
        }
        else if (GLOBAL_gameState === "play")
        {
            //just normal typing

            //go through all the texts and see if any of them matches
            for(let i = GLOBAL_PromptArray.length - 1 ; 0 <= i ; i--)
            {
                if (GLOBAL_PromptArray[i].text === temp_userText)
                {
                    let temp_currentNode = GLOBAL_PromptArray[i]

                    //add score
                    GLOBAL_Score += temp_userText.length
                    while (GLOBAL_Score > GLOBAL_Goal[GLOBAL_Diff])
                    {
                        GLOBAL_Score -= GLOBAL_Goal[GLOBAL_Diff]
                        GLOBAL_Diff++
                    }

                    if (GLOBAL_Diff >= 8)
                    {
                        console.log("player win")
                        GLOBAL_gameState = "player win"
                        clearInterval(GLOBAL_Interval_Run)
                        POwO_RedrawAll()
                    }

                    //effects ?
                    switch (temp_currentNode.effect) {
                        case "❤" : GLOBAL_HP += temp_currentNode.text.length ; break ;
                        case "⏳" : GLOBAL_Pocket_TimeAdd ++ ; break;
                        case "🐌" : GLOBAL_Pocket_NodeSlow ++ ; break ;
                        case "💥" : GLOBAL_Pocket_NodeBomb ++ ; break ;
                        default : break ;
                    }

                    //delete node
                    GLOBAL_PromptArray.splice(i,1)
                }
            }
        }

        


        GLOBAL_UserTextNode.text = ""
    }
    else if (event.key === "Backspace")
    {
        GLOBAL_UserTextNode.text = GLOBAL_UserTextNode.text.slice(0,-1)
    }
    else if (event.key === "Shift" || event.key === "Control" || event.key === "Meta")
    {
        //ignore
    }
    else
    {
        GLOBAL_UserTextNode.text += event.key
        
        
    }

    if (GLOBAL_gameState === "pause" || GLOBAL_gameState === "stand by"){POwO_RedrawAll()}
})

var GLOBAL_Interval_Run = 0

