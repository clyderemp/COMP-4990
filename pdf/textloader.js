document.getElementById("chooseFile").addEventListener('change', function() { 
              
    var fr=new FileReader(); 



    fr.onload=function(){ 
        var i;
        document.getElementById('content').innerHTML = "";
        var  blockArray = []; //USED FOR STORING THE BLOCKS EXTRACTED
        var lineArray = [];
        var filtered = fr.result.trim(); //TRIMS ALL OF THE UNNECESSARY WHITESPACES
        var pages = filtered.split("\n\n"); //splits each page into an array



        /**
         * FOR ALL PAGES
         * CONVERT EACH PAGE STORED INTO THE PAGE ARRAY INTO A STRING
         * ONCE CONVERTED INTO A STRING, SPLIT BY A NEW LINE WITH A WHITESPACES
         * STORE IT INTO THE BLOCKSPLITTER ARRAY AND SHIFT ONE TO THE LEFT TO REMOVE THE PAGE NUMBER
         */
        for(var a=0; a<pages.length; a++){
            var str = pages[a].toString();
            var blockSplit = str.split("\n ");
            blockSplit.shift(); //now we have an array of blocks
       

            /**
            * NOW TAKE THE BLOCKSPLITTER ARRAY
            * FOR ALL OF THE BLOCKS COLLECTED FROM THE WHOLE PDF FILE
            * REMOVE ANY UNNECESSARY WHITE SPACES ONCE AGAIN
            * AFTER THIS, YOU SHOULD HAVE A BLOCK ARRAY OF FILTERED BLOCKS
            */
            for(var b=0; b<blockSplit.length; b++){
                if(blockSplit[b].trim()!=""){
                 blockArray.push(blockSplit[b]);
                }
            }
        }

        /**
         * EACH BLOCK HAS A BUNCH OF LINES IN THEM
         * AS WE GO THROUGH EACH LINE IN A BLOCK, WE STORE THOSE INTO THE LINE
         * EACH LINE IS THEN PUSHED INTO THE LINEARRAY IF ITS NOT A EMPTY LINE
         */
        for(var c=0;c<blockArray.length; c++){
            var blockStr = blockArray[c].toString();
            var lines = blockStr.split("\n"); //line1,line2,line3 array

            for(var d=0; d< lines.length; d++){
                if(lines[d].trim()!=""){
                    lineArray.push(lines[d]);
                }
            }
        }
        

        //PRINTS OUT  ALL OF THE LINE INDIVIDUALLY
       for(var i=0; i<lineArray.length; i++){
        document.getElementById('content').innerHTML += "\nLINE:"+i+": "+lineArray[i];
        }
        //PRINTS THE TOTAL PAGES, BLOCKS, and LINES
        document.getElementById('pages').innerHTML = "PAGES: "+pages.length+"\tBLOCKS: "+blockArray.length+" LINES: "+lineArray.length;
        
    } 
      
    fr.readAsText(this.files[0]); 
}) 
