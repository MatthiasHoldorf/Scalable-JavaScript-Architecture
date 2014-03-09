var assert = (function() {
    ///////////////////
    // public scope
     return {
         equals : function (value, text) {
             var li = document.createElement("li");
             li.className = value ? "pass" : "fail";
             li.appendChild(document.createTextNode(text));
             document.getElementById("result").appendChild(li);
         },
         context : function (text) {
             var p = document.createElement("p");
             p.appendChild(document.createTextNode(text));
             document.getElementById("result").appendChild(p);
         }
     };
}());