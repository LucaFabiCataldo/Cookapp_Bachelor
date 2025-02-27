Bitte beachten: Die Anwendung wurde auf einem Macbook für den Browser Chrome umgesetzt und auch in dieser Umgebung verwendet.
Bei der Verwendung innerhalb einer anderen Arbeitsumgebung kann es zu unerwarteten Problemen kommen.
Besonders durch die Web Speech API sind Fehler durch die Verwendung in einem anderen Browser nicht unwahrscheinlich.


Starten der Datei:
Die Datei kann gestartet werden, indem man jeweils das Backend und das Frontend aktiviert. Anschließend öffnet sich automatisch der Browser mit der Anwendung.
Zuerst muss das Backend und anschließend das Frontend gestartet werden. Das Starten der Anwendung wird ebenfalls für das Macbook erläutert, für die Windowsumgebung können sich die Befehle unterscheiden

-Öffnen Sie den Ordner der gesamten Anwendung in VS-Code (das Starten des Backends und des Frontends wird ab diesem Schritt erläutert)


Starten des Backends:
-Öffnen Sie ein neues Terminal
-Gehen SIe in den Backend-Ordner	(Befehl: cd backend_fastapi)
-Starten Sie das Backend 			    (Befehl: uvicorn main:app --reload)


Starten des Frontends: -Öffnen Sie ein neues Terminal
-Gehen Sie in den Frontend-Ordner 	(Befehl: cd frontend_react)
-Starten Sie das Frontend 		    	(Befehl: npm start)


Stoppen der Anwendung:
-Um die Anwendung zu stoppen schließen Sie einfach die Terminals
