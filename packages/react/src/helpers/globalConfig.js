let root = document.documentElement;
const elementsConfig = [
    {
        type:"title", 
        color:"#4287f5",
    },
    {
        type:"div", 
        color:"#c43751",
    },
    {
        type:"text", 
        color:"#45baba",
    },
    {
        type:"image", 
        color:"#fcba03",
    },
];

// **************** < ENABLE ELEMENTS OUTLINE > **************** //
const enableElementsOutline = (showOutline) => {   
    root.addEventListener("keypress", event => {  
        if(window.event.keyCode === 96){
            showOutline = !showOutline;
            elementsConfig.forEach((element) => {
                showOutline ? 
                root.style.setProperty(`--show-${element.type}-outline`, `0.2rem solid ${element.color}`) :
                root.style.setProperty(`--show-${element.type}-outline`, "none");
            })
        }
      });
}

export default enableElementsOutline;