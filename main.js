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

function POwO_Math_IsInRange_Exclusive(inMin, inVal, inMax)
{
    return inMin < inVal && inVal < inMax
}




// ---- ---- ---- ---- SETUP

class TextNOwOde
{
    constructor(inText, inPosX, inPosY, inVel, inW, inH)
    {
        this.text = inText
        this.x = inPosX
        this.y = inPosY
        this.v = inVel

        this.w = inW
        this.h = inH
    }

    move ()
    {
        this.y += this.v
    }

    drawMe ()
    {
        //first the tag
        ctx.beginPath()
        ctx.fillStyle = "#202020"
        ctx.roundRect( this.x - this.w/2 , this.y - this.h/2 , this.w, this.h, 16 )
        ctx.fill()

        //then the text
        ctx.font = "20px Calibri"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = "#FFFFFF"
        ctx.fillText(this.text, inX, inY)
    }
}

const canvas = document.getElementById("kanvas");
const ctx = canvas.getContext("2d");
const HTML_Body = POwO_docgetel("HTML_body")

var GLOBAL_UserTypeBox = ""
var GLOBAL_PromptArray = []





// ---- ---- ---- ---- page function

function POwO_Kanvas_DrawTag(inX, inY, inW, inH, inR, inTagColor, inTextString, inTextColor, inTextFont)
{
    
}

function POwO_RedrawAll()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("message",(event) => {
    GLOBAL_Angle = event.data / 360 * Math.PI * 2
    POwO_RedrawAll();
})


HTML_Body.addEventListener("keypress",(event) => {})


// ---- ---- ---- ---- RUN MAIN

POwO_RedrawAll()


