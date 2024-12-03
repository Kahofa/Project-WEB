document.getElementById('create').addEventListener("click", function checkInput(event){
    event.preventDefault();
    let input = document.getElementById('input1');
    let errorCheck = document.getElementById('errorCheck');
    
    let error = ""
    if( input.value.length < 20){
        error = "Пожалуйста, опишите вашу идею более подробнее";
    }
    else if( input.value.length > 70){ 
        error = "Пожалуйста, опишите вашу идее менее подробнее";
    }
    if(error){
        document.getElementById('errorCheck').innerHTML = error;
        
    }
    else{
        loadAppScript();
        document.getElementById('errorCheck').innerHTML = "";
    }
});
function loadAppScript(){
    const script = document.createElement('script');
    script.src = "js/index/app.js"
    document.body.appendChild(script)
} 