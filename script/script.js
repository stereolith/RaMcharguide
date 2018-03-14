function loadxml(url, cFunction) { // lädt xml-Instanz von url, bei Antwort wird cFunction aufgerufen
    var xmlHttp = new XMLHttpRequest(); //neues xmlHttpRequest-Objekt wird iniziiert
    xmlHttp.onreadystatechange = function() {
        if (this.readyState == 4) { //die folgene Funktion wird ausgeführt, wenn die Antwort des Servers angekommen ist (Status: DONE)
            cFunction(xmlHttp.responseXML); //Callback-Funktion mit dem Namen cFunction wird aufgerufen, das vom Server geladene responseXML-Objekt wird zur weiteren Verarbeitung der Daten übergeben
        }
    };
    xmlHttp.open("GET", url, true); //xmlhttp-Anfrage wird geöffnet: GET-Methode, asynchron an der URI aus dem parameter url
    xmlHttp.send(); //Anfrage wird gesendet
}

function loadFigurenListe(xml){ //Diese callback-Funktion liest XML-Instanz aus: für jede "figur" wird der "vorname" und "nachname" in einer liste dargestellt
    document.getElementById("charakterSeite").style.display = "none"; //Charakterseite ausblenden
    var liste = ""; //leere liste wird erstellt (wird mit html-Code befüllt)
    var x = xml.getElementsByTagName("figur"); //array mit allen Figuren wird erstellt
    for (i=0; i<x.length; i++){ //für jede Figur: elemente "vorname" und "nachname" werden ausgelesen, beides mit link zum aufrufen der entsprechenden Characterseite versehen (loadChar mit Parameter i)
        liste += "<tr><td><a href='javascript:loadChar(" + i + ");'>" + x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue; //eine listenzeile wird als string in html-code generiert, die den Namen der aktuelen Figur enthält, dazu einen Link zur Charakterseite der Aktuellen Figur (js-Funktion loadChar, es wird das aktuelle i Übergeben)
        if(x[i].getElementsByTagName("nachname").length > 0){ //Prüft, ob nachname vorhanden ist
            liste += " " + x[i].getElementsByTagName("nachname")[0].childNodes[0].nodeValue + "</a></tr>"; //nachname wird mit leerzeichen angehängt, link- und tabellentags werden geschlossen
        }
        else{
            liste += "</a></tr>";
        }
    }
    document.getElementById("liste").innerHTML = liste; //liste-String wird in das entsprechende Tabellen-Element gesetzt
    document.getElementById("charakterListe").style.display = "initial"; //charakterListe wird angezeigt
}

function loadCharSeite(xml, i){  //lädt die Characterseite des Characters an der Stelle i des Arrays aller Figuren
    if(document.getElementById("charakterListe") != null){ //prüft, ob Element charakterListe vorhanden ist (ist nicht vorhanden bei rand.html)
        document.getElementById("charakterListe").style.display = "none"; //charakterListe wird ausgeblendet
    }
    var x = xml.getElementsByTagName("figur")[i];

    //tabelle in figures.html wird mit Inhalt befüllt, angesprochen über die IDs der zu füllenden td-Elemente:
    if(x.getElementsByTagName("nachname").length > 0){ //Prüft, ob nachname vorhanden ist
        document.getElementById("charName").innerHTML = document.getElementById("charName").innerHTML = x.getElementsByTagName("name")[0].childNodes[0].nodeValue + " " + x.getElementsByTagName("nachname")[0].childNodes[0].nodeValue; //nachname ist vorhanden: vorname und nachname in das Element charName einsetzen
    }
    else{
        document.getElementById("charName").innerHTML = x.getElementsByTagName("name")[0].childNodes[0].nodeValue;//nachname nicht vorhanden: nur vorname in charName einsetzen
    }
    document.getElementById("charKategorie").innerHTML = x.getElementsByTagName("category")[0].childNodes[0].nodeValue;
    document.getElementById("charFirstseen").innerHTML = "S" + x.getElementsByTagName("season")[0].childNodes[0].nodeValue + "E" + x.getElementsByTagName("episode")[0].childNodes[0].nodeValue; //generiert die Folge des ersten Auftretens nach dem Schema S1E10
    if(x.getElementsByTagName("age").length > 0){
        document.getElementById("charAlter").innerHTML = x.getElementsByTagName("age")[0].childNodes[0].nodeValue;
    }
    else{
        document.getElementById("charAlter").innerHTML = ""
    }
    if(x.getElementsByTagName("planetoforigin").length > 0){
        document.getElementById("charHerkunft").innerHTML = x.getElementsByTagName("planetoforigin")[0].childNodes[0].nodeValue;
    }
    else{
        document.getElementById("charHerkunft").innerHTML = "";
    }
    if(x.getElementsByTagName("species").length > 0){
        document.getElementById("charSpezies").innerHTML = x.getElementsByTagName("species")[0].childNodes[0].nodeValue;
    }
    else{
        document.getElementById("charSpezies").innerHTML = "";
    }
    document.getElementById("charBeschreibung").innerHTML = x.getElementsByTagName("beschreibung")[0].childNodes[0].nodeValue;
    document.getElementById("charFoto").setAttribute("src", x.getElementsByTagName("picture")[0].childNodes[0].nodeValue); //"src"-Attribut des img-Elementes wird auf die URL des zu zeigenden Fotots gesetzt
    document.getElementById("charakterSeite").style.display = "initial"; //charakterSeite wird angezeigt
}

function loadChar(i){ //lädt die loadxml-Funktion; erlaubt ein Übergeben der variable i in die callback-Funktion loadCharSeite, damit das entsprechende Element des Arrays aller Figuren ausgewählt werden kann
    loadxml('xml/figurenverzeichnis.xml',function(xmlHttp){ //Übergabe der Variable i in einer callback-wrapper funktion
        loadCharSeite(xmlHttp, i);}
           );
}

function randChar(xml){ //erstellt eine zufällige ganze zahl zw 0 und der Anzahl aller Figuren - 1
    var random = Math.floor((Math.random() * xml.getElementsByTagName("figur").length) + 1) - 1;
    loadChar(random); //führt funktion loadChar mit dem Zufallswert aus
}