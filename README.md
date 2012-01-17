# nexus-web

a webinterface for [nexus](http://github.com/guybrush/nexus).

you can install it with `npm install -g nexus-web`. then you can start it with:

    nexus-web -h localhost -p 3000 -H 123.456.789.012 -P 1337
    
where `-h`/`-p` is the local host/port where you want to host the webinterface 
and `-H`/`-P` is the host/port of the nexus you want to access.

or if there is a locally installed nexus (running on port `1337` you can install 
and start/stop nexus-web like that:

    nexus install nexus-web
    nexus start nexus-web -p 3000 -P 1337

