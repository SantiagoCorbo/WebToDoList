window.addEventListener("load", start);

function start(){
    
//List
var taskList = [];
var errorList = [];

//Constructor
class Task {
    constructor (taskName, taskResponsible, taskFinishDate, taskDescription, finished){

            this.name = taskName;
            this.responsible = taskResponsible;
            this.finishDate = taskFinishDate;
            this.description =  taskDescription;  
            this.finished = finished;
            this.timeToEnd = timeBetweenActualDateAndFinish(taskFinishDate) ;
            
        }    
}


//Global variables

let taskSelected = null;
let taskToEdit = null;
let editListener = null;
let cancelEditListener = null;
let OrderListListener = null;


//Lisen to the form main and try to create a task with the recibed data
document.getElementById("formMain").addEventListener("submit", function(e){
    var taskName = document.getElementById("taskName").value;
    var taskResponsible = document.getElementById("taskResponsible").value;
    var taskFinishDate = document.getElementById("taskFinishDate").value;
    //date is transformed to dd/mm/yyyy format
    taskFinishDate = textBarHyphenDivider(taskFinishDate);
    taskFinishDate = taskFinishDate[2]+ "/" + taskFinishDate[1] + "/" + taskFinishDate[0];
    //Continue to get data
    var taskDescription = document.getElementById("taskDescription").value;
    var taskFinished = document.getElementById("slcFinished").value;
    //here i verify if it is finished and return true or false
    taskFinished = verifyFinishTaskData(taskFinished);
    //then i send all data to be verified and create a new object task
    createTask(taskName, taskResponsible, taskFinishDate, taskDescription, taskFinished);
    e.preventDefault();
});
//here i verify if it is finished and return true or false
function verifyFinishTaskData(data){
    let finished = false;
    if(data === "1")finished = true;
    return finished;
}
//create a new task if data recived is correct
function createTask(taskName, taskResponsible,
    taskFinishDate, taskDescription, finished){
        var feedBack = "";        
        //here i verify if all data is correct
        if(verifyText(taskName) && verifyText(taskResponsible) &&
        verifyText(taskDescription)){
            if(!taskAlreadyExist(taskName)){
                //then i creat a new object task and push it to taskList
                var task = new Task(taskName, taskResponsible, taskFinishDate, taskDescription, finished);
                taskList.push(task);
                clearTaskForm();
            }else{
                feedBack += "La tarea ya existe. ";
            }                       
        }else{
            feedBack += "Verifique los datos ingresados. ";
        }
        //if there is any issue it will be on errorList
        if(feedBack !== ""){
            errorList.push(feedBack);   
        }        
        showTaskList(0);
        showErrorList();

}

//clear all data introduced in form main
function clearTaskForm(){
    document.getElementById("taskName").value = "";
    document.getElementById("taskResponsible").value = "";
    document.getElementById("taskDescription").value = "";
    //alert("Tarea creada");
}
//search on taskList if the name of this task already exists
function taskAlreadyExist(taskName){
    let exist = false;
    taskList.forEach(task => {
        if(task.name === taskName) exist = true;
    });
    return exist;
}

//given a text it verify if its length is bigger than 3 characters, taht it is not null or undefined
function verifyText(text){
    var textOK = false;
    if(text !== null && text !== undefined && text !== " " && text.length >= 3){
        textOK = true;
    }
    return textOK;
}

//given a number this function verify if it es not null not undefined not NaN and equals or bigger than 0
function verifynumber(number){
    var numberOK = false;
    if(number !== null && number !== undefined && !isNaN(number) && number >= 0){
        numberOK = true;
    }
    return numberOK;
}


//Given a finish date (in format dd/mm/yyyy) it returns you time between actual date and finish date
function timeBetweenActualDateAndFinish( finishDate){
    let output = "Tiempo expirado";
    //I get actual date
    let actualDate = new Date;
    //then it is transformed in an string with this format "DD/MM//YYYY"
    let dateString = actualDate.getDate() + "/" + actualDate.getMonth() + "/" + actualDate.getFullYear(); 
    //Then divide the strings in arrays  with format [day, month, year]
    dateString = textBarHyphenDivider(dateString);
    finishDate = textBarHyphenDivider(finishDate);
    //if year of finishDate is lesser or equal than todays year
    if(dateString[2] <= finishDate[2]){
        output = diferenceBtweenDates(dateString, finishDate);
        if(output < 0) output = "Tiempo expirado";
    }else{
        errorList.push("El año de finalización es menor que el actual");
    }
    return output;
}

//return diference in days between 2 dates, both dates are an array like this [day, month, year]
function diferenceBtweenDates(date1, date2){
    let diference = null;
    //calculete diference between days
    diference = parseInt(date2[0]) - parseInt(date1[0]);
    //calculate diference between month
    diference += ((parseInt(date2[1]) - parseInt(date1[1])) * 30);
    //calculate diference between years
    (diference += (parseInt(date2[2]) - parseInt(date1[2])) * 365);
    if(diference >= 0 ) diference = diference + " Días";
    return diference; 
}
//shows the taskList list in a specified container as html
function showTaskList(order){
    //Only show task list if there is any task
    if(taskList.length > 0){
        var taskListContainerDOM = document.getElementById("taskListContainer");
        var listDOM ="";               
        taskList.forEach(task => { 
            let l = "<a href='#taskViwer' rel='tag'>";                     
            l += "<ul class='singleTaskContainer' name='singleTaskContainer'";            
            l += "<li><h4>" + task.name + "</h4></li>";
            l += "<li>" + task.responsible + "</li>";
            l += "<li>" + task.description + "</li>";
            l += "<li>" + task.finishDate + "</li>";
            l += "<li>" + "Tiempo para que termine: " + task.timeToEnd + "</li>";                     
            l += "</ul></a>"
            if(task.finished && order == 2){
                listDOM += l;
            }else if(order == 1 && !task.finished){
                listDOM += l;
            }else if(order == 0){
                listDOM += l;
            }
           
        });        
        //document.getElementById("finishedTaskListContainer").innerHTML = listDOMFinished;
        taskListContainerDOM.innerHTML = listDOM;
        listDOM ="";
    }else{
        errorList.push("No hay tareas para mostrar. ");
    }
    OrderListListener = document.getElementById("slcOrder").addEventListener("change", (e)=>{
        //console.log(e.currentTarget.value);
        showTaskList(e.currentTarget.value);
    });
}


//shows a specified task on a container
function showTask(task){
    //create an html table showing task data
    var table = "";
    var htmlText = "<table class='taskData'>";
    htmlText += "<tr>" + "<td>Nombre de la tarea:</td>" + "<td>" + task.name + "</td>" + "</tr>";
    htmlText += "<tr>" + "<td>Responsable de la tarea:</td>" + "<td>" + task.responsible + "</td>" + "</tr>";
     htmlText += "<tr>" + "<td>Fecha de finalización de la tarea:</td>" 
     + "<td>" + task.finishDate + "</td>" + "</tr>";
     htmlText += "<tr>" + "<td>Descripción de la tarea:</td>" + "<td>" + task.description + "</td>" + "</tr>";
     htmlText += "<tr>" + "<td>Tarea finalizada:</td>" + "<td>" + isTaskFinished(task.finished) 
     + "</td>" + "</tr>";
    htmlText += "</table";
    htmlText += "<tr>" + "<td><input type='button' value='Finalizar' name='" + task.name +
     "' id='btnFinishTask'></td>"
     + "<td><input type='button' value='Editar' name='" + task.name + 
     "' id='btnEditTask'></td>" + "</tr>";
    table = htmlText;
    //put the table on html
    document.getElementById("taskViwer").innerHTML = table;
    //asign golbal variable taskSelected with the actual task
     taskSelected = task;
    //start listening to buttons created
    activarEscucha();

}
//shows a task to be edited
function showTaskToEdit(){
    //get the name of the task
    let name = document.getElementById("btnEditTask").name;
    //find the task with it name
    let task = findTaskWithName(name);
    //create a form to edit task content.
    let htmlText = "";
    htmlText += "<span class='spnEdit'>Nombre de la tarea: </span> <input type='text' class='iptEdit' id='txtEditName' placeholder='"
     + task.name + "'> <br>";
     htmlText += "<span class='spnEdit'>Nombre del responsable: </span> <input type='text' class='iptEdit' id='txtEditResponsible' placeholder='"
     + task.responsible + "'> <br>";
     htmlText += "<span class='spnEdit'>Fecha de finalización: </span> <input type='date' class='iptEdit' id='dteEditDate' placeholder='"
     + task.date + "'> <br>";
     htmlText += "<span class='spnEdit'>Descripción de la tarea: </span> <input type='textarea' class='iptEdit' id='txaEditDescription' placeholder='"
     + task.description + "'> <br>";
     htmlText += "<input type='button' class='btnEdit' id='btnConfirmEdit' value='Confirmar cambios'>";
     htmlText += "<input type='button' class='btnEdit' id='btnCancelEdit' value='Cancelar'>";
     document.getElementById("taskViwer").innerHTML = htmlText;
     //re asign global variable so buttons work well and start listening
     taskToEdit = task;
     taskSelected = null;
     activarEscucha();
     //hidding all unnecesary things
     hideOrShowAllButEditTask();
}

//hide or show task list and form
function hideOrShowAllButEditTask(){
    var hide = document.getElementsByClassName("hideOrShow");
    for(i = 0; i < hide.length; i++){
        if(hide[i].style.display == "none"){
            hide[i].style.display = "";
        }else{
            hide[i].style.display = "none";
        }
        
    }
    console.log(hide);
}

//given a bool var from the task it returns a message showing it state
function isTaskFinished(bool){
    var message = "No finalizada";
    if(bool) message = "Finalizada";
    return message;
}

//Pre charge some tasks
function preCarga(){
//taskName, taskResponsible, taskDurationHours, taskDurationMinutes, taskStartDate,
//taskFinishDate, taskDescription
    createTask("Barrer", "Sasha",  "8/6/2021", "Debes barrer la sala y la cocina", true);
    createTask("Fregar", "Katrina",  "8/8/2021", "Hay platos pendientes por limpiar en la cocina", true);
    createTask("Limpiar", "Sintula",  "8/3/2021", "Limpiar las computadoras", false);
    createTask("Ordenar", "Santiago", "1/2/2023", "Ordenar las carpetas del escritorio", false);

}
preCarga();

//shows a task content when you click on it in task list
document.getElementById("taskListContainer").addEventListener("click", function(e){
     
    var content = e.target;
    if(content.nodeName === "UL"){
       content = textLaneJumpDivider(content.innerText);
    }else if(content.nodeName === "LI" || content.nodeName === "H4"){
        content = textLaneJumpDivider(content.parentNode.innerText);
    }   
    showTask(findTaskWithName(content[0]));
});


//given a text you obtain all their parts between /n as elements in an array
function textLaneJumpDivider(text){
    var arrayText = [];
    var textFragment = "";
    for(i = 0; i < text.length; i++){
        if(text[i] === "\n"){
            arrayText.push(textFragment);
            textFragment = "";
        }else{
            textFragment += text[i];
        }
    }
    return arrayText;
}

//given a text you obtain all its parts between "/" and "-" as strings in an array
function textBarHyphenDivider(text){
    var arrayText = [];
    var textFragment = "";
    for(i = 0; i < text.length; i++){
        if(text.length - 1 === i && text[i +1] === undefined){
            textFragment += text[i]
            arrayText.push(textFragment);
        }
        else if(text[i] === "/" || text[i] === "-"){
            arrayText.push(textFragment);
            textFragment = "";
        }else{
            textFragment += text[i];
        }
    }
    return arrayText;
}

//Given a task name it finds a coincidence in taskList
function findTaskWithName(arrayContent){
    var taskFinded = null;
    taskList.forEach(task => {
        if(arrayContent === task.name){
            taskFinded = task;
        }
    });
    
    return taskFinded;
}

//creates an event listener for a task selected from the list for the finish button
function thereIsATaskSelected(){
    let taskObtained = document.getElementById("taskViwer");
    console.log(taskObtained);
    if(taskObtained !== null && taskObtained !== undefined){
        console.log("Estamos aquí");
       
    }
}

//Listen to buttons that are generated from js only if conditions are fullfiled
function activarEscucha(){
    //listen to finish task button and edit task button
    if(taskSelected !== null){
        taskSelected = document.getElementById("btnFinishTask").addEventListener("click", finishTask);
        taskSelected = document.getElementById("btnEditTask").addEventListener("click", showTaskToEdit);
    }
    //listen to confirm edit task button and cancel edit task button
    if(taskToEdit != null){
        editListener = document.getElementById("btnConfirmEdit").addEventListener("click", editTask);
        cancelEditListener = document.getElementById("btnCancelEdit").addEventListener("click", cancelEditTask);     
    }
     
}


   
//A task get the finished state
function finishTask(){  
    
    console.log("finalizando tarea");
        let name = document.getElementById("btnFinishTask").name;
        let task = findTaskWithName(name);
        console.log(task.name);
        if(confirmTaskFinish() && !task.finished){
            task.finished = true;
            showTask(task);
            showTaskList(0);
        }else{
            alert("La tarea ya fue finalizada");
        }
        console.log(task.finished.toString());
     
}

//User must confirm tasks completation
function confirmTaskFinish(){
    let finish = false;
     finish = confirm("¿Desea finalizar la tarea?");
    return finish;
}

//Once presed edit task button this functions take input data and change it
function editTask(){
    if(confirmTaskEdit()){
        //variables to store data
        let task = taskToEdit;
        let nameRecibed = "";
        let responsibleRecibed ="";
        let dateRecibed = null;
        let txtAreaRecibed = "";
        //getting data from user
        nameRecibed = document.getElementById("txtEditName").value;
        responsibleRecibed = document.getElementById("txtEditResponsible").value;
        dateRecibed = document.getElementById("dteEditDate").value;
        txtAreaRecibed = document.getElementById("txaEditDescription").value;
        //Verify data one by one and then replace it
        //verify name
        if(nameRecibed!== undefined && nameRecibed!== ""){
            task.name = nameRecibed;            
        }
        //verify responsible name
        if(responsibleRecibed!== undefined && responsibleRecibed!== ""){
            task.responsible = responsibleRecibed;            
        }
        //Verify date and convert it to format dd/mm/yyyy
        if(dateRecibed!== null && dateRecibed!== undefined && dateRecibed!== ""){
            dateRecibed = textBarHyphenDivider(dateRecibed);
            task.finishDate = dateRecibed[2]+ "/" + dateRecibed[1] + "/" + dateRecibed[0];            
        }
        //verify description
        if(txtAreaRecibed!== undefined && txtAreaRecibed!== ""){
            task.description = txtAreaRecibed;         
        }            
        //this is necessary for show task and edit task to work
        hideOrShowAllButEditTask();
        taskSelected = taskToEdit;
        taskToEdit = null;
        showTask(task);
        showTaskList(0);

    }
}

//Go back from editing task to only seeng task
function cancelEditTask(){  
    taskSelected = taskToEdit;
    taskToEdit = null;  
    showTask(taskSelected); 
    hideOrShowAllButEditTask();   
}

//Ask user for an aditional input to confirm task edit
function confirmTaskEdit(){
    let edit = false;
     edit = confirm("¿Desea editar la tarea?");
    return edit;
}

//shows error list as a console text
function showErrorList(){
    errorList.forEach(error => {
        console.log(error);
    });
}
showErrorList();
}
/* Necesito escribir la funcionalidad para calcular el tiempo que resta para terminar la tarea(listo), 
funcionalidad para cambiar el estado de finalizado(listo),
mostrar lista de tareas finalizadas y no finalizadas de forma separada(listo), 
las tareas pueden comenzar ya finalizadas(listo),
poder acceder a las tareas de forma individual(listo),
editar tareas(listo),
arreglar que se puedan editar las fechas(listo),
menú desplegable en la lista de tareas para mostrar las tareas finalizadas...
y no finalizadas por separado o todo junto(listo),
crear un menu(descartado),
arreglar ingreso de fechas(listo),
mover pantalla hacia la tarea seleccionada(listo),
sistema de errores(listo, solo consola), 
refactorizar

*/
