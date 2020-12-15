document.getElementById("chooseFile").addEventListener('change', function() { 

              
    var fr=new FileReader(); 



    fr.onload=function(){ 
        document.getElementById('content').innerHTML = "";
        var pageArray = [];
        var  blockArray = []; //USED FOR STORING THE BLOCKS EXTRACTED
        var lineArray = [];
        var filtered = fr.result.trim(); //TRIMS ALL OF THE UNNECESSARY WHITESPACES
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
                    lineArray[e].includes("Term") || lineArray[e].includes("Bachelor") || lineArray[e].includes("Name") || lineArray[e].includes("ID") ||
                        lineArray[e].includes("CourseDescription") || lineArray[e].includes("Standing") || lineArray[e].includes("Record") || lineArray[e].includes("Print")){
                            
                            lineArray.pop();
                    }
                }   
            }
        }

        for(var i=0; i<lineArray.length;i++){
            document.getElementById('content').textContent += "\n"+lineArray[i];
        }


            

        //PRINTS THE TOTAL PAGES, BLOCKS, and LINES
        document.getElementById('pages').innerHTML = "PAGES: "+pages.length+"\tBLOCKS: "+blockArray.length+" LINES: "+lineArray.length;

          
        
    } 
      
    fr.readAsText(this.files[0]); 
}) 


