document.getElementById('create').addEventListener("click",function contest(event){
    event.preventDefault();
    let input = document.getElementById('input1').value;
    if(input.length > 1){
        alert("ура, прошед")
        loadScript();
    }else alert("не прошел")
})
function loadScript(){
    const script = document.createElement("script");
    script.src= "js/index/second.js";
    document.body.appendChild(script);
}

