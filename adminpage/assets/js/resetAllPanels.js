function resetAllPanels(){

    //RESET ALL SEARCH VALUES
    document.getElementById("user-drop").value = "none";
    document.getElementById("email").value = "";
    document.getElementById("resultsContent").style.display = "none";

    //RESET ALL ACCOUNT MANAGER VALUES
    document.getElementById("manager-drop").value = "none";
    document.getElementById("formPanel").style.display = "none";
    document.getElementById("formPanel").reset();

    //RESET ALL COURSE MANAGER VALUES
    document.getElementById("emailProf").value = "";
    document.getElementById("viewAccount2").style.display = "none";
    document.getElementById("resultsContent2").style.display = "none";
}