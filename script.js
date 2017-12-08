var submitButton = document.getElementById("submit");
submitButton.onclick = function() {
	var textBox = document.getElementById("textbox");
    var data = textBox.value;
        
	var xhttp = new XMLHttpRequest();
	/*xhttp.onreadystatechange = function() {    
		if(xhttp.readyState === XMLHttpRequest.DONE) {
			if(xhttp.status === 200) {
				//On success
			}
		}
	};*/
  xhttp.open("POST", "http://localhost:8080/output", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify({data: data}));
};