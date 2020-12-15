(function() {
    document.getElementById('output').style.display = 'none';

    //WHEN A PDF FILE IS SELECTED, DO THIS
    var laddaButton = Ladda.create(document.querySelector( '.btn-file' ));
    document.querySelector('#file').addEventListener('change', function(e) {

        var fileReader = new FileReader();
        fileReader.onload = function(e) {
  
            PDFJS.getDocument(e.target.result).then(function(pdf) {
                var items = [];
                var pagesRemaining = pdf.pdfInfo.numPages;
                
                //For every pages, read each line
                for(var i = 1; i <= pdf.pdfInfo.numPages; i++) {
    
                    pdf.getPage(i).then(function(page) {
        
                        page.getTextContent().then(function(textContent) {
                            var previousHeight = NaN;
                            var currentString = [];
        
                            /**
                             * PUSH EACH LINE READ INTO A STRING
                             */
                            for(var j = 0; j < textContent.items.length; j++) {
                                
                                var item = textContent.items[j];
                                        
                                if(item.transform[5] != previousHeight) {
                                        
                                    previousHeight = item.transform[5];
                                    items.push({item: item, str: currentString.join('')});
                                    currentString = [item.str];
                                }
                                else{
                                    currentString.push(item.str);  
                                }
                            }
        
                            pagesRemaining--;
        
                            /**
                             * WHEN THERE ARE NO MORE PAGES LEFT, ENSURE TO OUTPUT THE DATA OR RETURN ERROR
                             */
                            if(pagesRemaining == 0) {
        
                                var outputContainer = document.querySelector('#output');
                                
                                outputContainer.style.display = 'none';
                            
                                if(items.length) {
                                    outputContainer.style.display = 'block';
                                    outputContainer.innerHTML = '';
                    
                                    items.forEach(function(item) {
                                        var div = document.createElement('div');
                                        div.textContent = item.str;
                                        outputContainer.appendChild(div);
                                    });

                                }else {
                                }
                                laddaButton.stop();
                                parseAndFilter();
                            }
    
                        });
    
                    });
    
                }

            });

        };
        if(e.target.files && e.target.files[0]) {
          laddaButton.start();
          //ga('send', 'event', 'button', 'click', 'convert pdf to text');
          fileReader.readAsArrayBuffer(e.target.files[0]);
          currentFilename = e.target.files[0].name;
        }
    });
    //END OF PDF EXTRACTOR

    //START OF TRANSCRIPT PARSER
    function parseAndFilter(){ 
        var str = document.querySelector('#output').innerHTML;
       
        document.getElementById('output').style.display = 'none';
        var  blockArray = [];   //USED FOR STORING THE BLOCKS EXTRACTED
        var lineArray = [];     //USED FOR STORING THE LINES WITHIN THE BLOCKS

        /**
         * TAKE THE ENCRYPTED DATA AND DECRYPT IT TO BE PARSED
         * THIS IS DONE SO THE TRANSCRIPT DATA IS NOT BREACHED
         */
        
        try{ //TRY AND CATCH ERROR

            var filtered = str.trim(); //TRIMS ALL OF THE UNNECESSARY WHITESPACES

            var pages = filtered.split("<div></div><div>"); //splits each page into an array
            pages.shift();
            

            /**
             * FOR ALL THE TOTAL PAGES, SPLIT EACH ONE INTO BLOCKS
             * AFTER SPLITTING, PUSH THROUGHH THE BLOCK ARRAY
             */
            for(var a=0; a<pages.length; a++){

                var blockSplit = pages[a].split("</div><div>      </div><div>"); //THIS IS THE HTML DIVISION SAVED INTO THE TXT FILE, WE SPLIT EACH BLOCK BASED ON THIS

                for(var b=0; b<blockSplit.length; b++){

                    blockArray.push(blockSplit[b]);
                }
            }


            /**
             * NOW, FOR EACH BLOCK, WE MUST SPLIT EACH LINE AND CONVERT IT INTO STRINGS
             * ONCE, CONVERTED, PUSH EACH ONE INTO THE LINE ARRAY
             */
            for(var c=0; c<blockArray.length;c++){

                var lineSplit = blockArray[c].split("</div><div>"); //THIS IS THE HTML DIVISION SAVED INTO THE TXT FILE FOR EACH LINE

                //FOR EACH LINE SPLIT, WE TURN EACH ONE INTO A STRING AND TRIM ALL UNNECESSARRY WHITE SPACES
                for(var d=0; d<lineSplit.length; d++){

                    var str = lineSplit[d].toString();      //CONVERT EACH LINE INTO A STRING
                    var st2 = str.replace("</div>", "");
                    lineArray.push(st2.trim());             //PUSH INTO THE ARRAY
                    

                    /**
                     * FOR FINALIZING EACH LINE AND TAKING OUT UNNECESSARY INFORMATION
                     * WE TAKE OUT EACH LINE THAT CONTAINS EACH OF THE FOLLOWING KEYWORD
                     * WE SHOULD BE LEFT WITH THE IMPORTANT ONES
                     * SUCH AS THE OEN, COURSES, GRADE, SEMESTER AVERAGE, CUMULATIVE AND MAJOR AVERAGE
                     */
                    for(var e=0; e<lineArray.length; e++){
                        if(lineArray[e].includes("Attempted") || lineArray[e].includes("Transcript") || lineArray[e].includes("of "+pages.length) || 
                         lineArray[e].includes("Name") || lineArray[e].includes("ID") ||
                            lineArray[e].includes("CourseDescription") || lineArray[e].includes("Standing") || lineArray[e].includes("Record") || lineArray[e].includes("Print")){
                                
                                lineArray.pop();
                        }
                    }   
                }
            }

            /**
             * PRINT OUT THE LINE ARRAY
             */
            document.getElementById('output').textContent = ""
            for(var i=0; i<lineArray.length;i++){
                document.getElementById('output').textContent += "\n"+lineArray[i];
                
            }
            console.log(document.getElementById('output').innerHTML);
            savePDFtoTXT(document.getElementById('output').innerHTML);
        }
        //HANDLE ERRORS
        catch(err){
            //document.getElementById('pages').textContent = "You have selected either an invalid file OR an encrypted transcript file that belongs to someone else. Please try again!";
        }
    }
    //END OF PARSER

    //START TO SAVE FILE TO FIREBASE STORAGE
    function savePDFtoTXT(data){

        var encryptionKey = document.getElementById('idnum').textContent;
        var idnum = encryptionKey.split(': ');
        var userLevel = (document.getElementById('user-level').textContent).toLowerCase();
        var school = (document.getElementById('school').textContent).split(': ');

        var encrypted = CryptoJS.AES.encrypt(data, encryptionKey);

        var blob = new Blob([encrypted], {type: "text/plain;charset=utf-8"});
        var file = blob;
        //SET THE FILE PATH
        var userfilepath = 'transcript-storage/'+userLevel+'/'+school[1]+'/'+idnum[1]+'/';

        //create a storage ref
        var storageRef = firebase.storage().ref(userfilepath+'/transcript');

        //upload file
        var task =storageRef.put(file);

        Swal.fire({
            title: "<i id=percentage></i>", 
            html: '<div id=loadingSection ><progress class="progressbar" value="0" max="100" id="uploadValue"></progress></div>',
            showConfirmButton: false,
            allowOutsideClick: false,
            timer: 5000
        }).then(function() {
            swal("Your transcript has been successfully parsed and uploaded! We will now refresh the page to update your profile data.", {
                icon: "success",
                allowOutsideClick: false,
                buttons : {
                    confirm : {
                        text: 'Continue',
                        className: 'btn-success'
                    }
                }
            }).then(() => {
                location.reload();
            });
        });

        var resultText = document.getElementById("percentage"); //this is for the progress text
            resultText.style.fontWeight = "lighter";
        var loadingBar = document.getElementById("uploadValue"); //this is the loading bar

        task.on('state_changed',
            function progress(snapshot){//uploading process
                    
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
                
            loadingBar.value = percentage;

            document.getElementById('percentage').innerText = percentage.toFixed(0)+"%...uploading...";
            },

            function error(err){ //if the user uploads a non-pdf file
                loadingBar.style.display = "none";
                resultText.innerHTML = "Upload failed due to invalid input. Please upload a valid pdf file.";
                resultText.style.color = "red";
                console.log(err);
            },

            function complete(snap){ //succesful upload
                resultText.innerHTML = "loading..please wait...";
                document.getElementById('loadingSection').innerHTML += '<div class=loading-position><div class="loader"></div><div>';
                document.getElementById("uploadValue").value = 0;

                var userData = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection('student').doc('post-secondary').collection(uid).doc('userData'); //Sets the doc reference
                
                userData.get().then(function(doc) { //Gets the document reference and checks for the document
                        
                    if (doc.exists){
                        var transcriptUpdate = {newTranscript: 'true' }
                        userData.update(transcriptUpdate).then(function() {
                            console.log("New Transcript is being uploaded...");
                            deleteFirestore(userData,resultText);
                        });
                    }
                })
            }
        );

    }
    
    /**
     * This will reset the courses folder to be pdated
     * @param {Firestore path} docRef 
     * @param {For the the percentage} resultText 
     */
    function deleteFirestore(docRef, resultText){
        var loadingBar = document.getElementById("uploadValue");
        var courseRef = docRef.collection("courses");
        var courseList = [];
        var deletedCourses = 0;
        var percentage = 0;

        courseRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                courseList.push(doc.id);
                var coursePath = courseRef.doc((doc.id).toString());  //course --> COMP-1120

                coursePath.delete().then(function() {
                    deletedCourses++;
                    percentage = (deletedCourses / courseList.length) * 100;
                    loadingBar.value = percentage;
                    console.log("Course document successfully deleted!");
                    resultText.innerHTML = percentage.toFixed(0)+"%...updating in progress...";

                    if(percentage==100){
                        resultText.innerHTML = 'uploading to database...';
                        loadingBar.style.display = 'none';
                    }
                        
                }).catch(function(error) {
                    console.error("Error in deleting documents --> deleteFirestore()"+error);
                })
            })
        });  
    }
  
})();
//END OF FILEUPLOADER