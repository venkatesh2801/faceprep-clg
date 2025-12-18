const marginSlider = document.getElementById("marginRange");
const borderSlider = document.getElementById("borderRange");
const paddingSlider = document.getElementById("paddingRange");
const contentSlider = document.getElementById("contentRange");


const marginValue = document.getElementById("marginValue");
const borderValue = document.getElementById("borderValue");
const paddingValue = document.getElementById("paddingValue");
const contentValue = document.getElementById("contentValue");


const layer1 = document.getElementById("layer1");
const layer2 = document.getElementById("layer2");
const layer3 = document.getElementById("layer3");

marginSlider.addEventListener("input",() =>{
    marginValue.textContent =  marginSlider.value  + "px";
    layer1.style.margin = marginSlider.value + "px";
});
borderSlider.addEventListener("input", () =>{
    borderValue.textContent = borderSlider.value + "px";
    layer1.style.border = borderSlider.value + "px solid black";
    
});
paddingSlider.addEventListener("input", () =>{
    paddingValue.textContent = paddingSlider.value + "px";
    layer2.style.padding = paddingSlider.value + "px";
});
contentSlider.addEventListener("input", () =>{
    contentValue.textContent = contentSlider.value + "px";
    layer3.style.padding = contentSlider.value + "px";
});

