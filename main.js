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
    constructor(inText, inPosX, inPosY, inVel, inWidthMargin, inHeight, inFont, inFontToWidthRatio, inFillColor, inTextColor)
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

var GLOBAL_Diff = new TextNOwOde("0", ctx.width / 2 , GLOBAL_GroundLine, 0, 0, 100, "20px Calibri", 1) //0~15, each 1min30sec
var GLOBAL_Score = 0
var GLOBAL_HP = 50 //each character is 1HP
var GLOBAL_Hourglass = new hOwOrglass(100, 50, 0)

var GLOBAL_Dictionary = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","t","s","u","v","w","x","y","z"]





// ---- ---- ---- ---- page function


function POwO_RedrawAll()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        //check evrything
        //but for now, clear
        GLOBAL_UserTextNode.text = ""
    }
    else if (event.key === "Backspace")
    {
        GLOBAL_UserTextNode.text = GLOBAL_UserTextNode.text.slice(0,-1)
    }
    else if (event.key === "Shift")
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
                GLOBAL_Dictionary[ Math.floor(POWO_Math_Lerp(0, GLOBAL_Dictionary.length, Math.random())) ],
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

