var intellipay = {
    init: function(options){
        document.onclick = this.clickListener;
        document.addEventListener("keydown", this.keyListener);
        document.onmousemove = this.handleMouseMove;
        this.time = new Date();
    },
    time: null,
    handleMouseMove: function(e){
        var dot, eventDoc, doc, body, pageX, pageY;
        var now = new Date();
        var seconds = (now.getTime() - intellipay.time.getTime())/1000;
        if(seconds < 0.2){ //wait 0.2 sec to log
            return;
        }
        event = e || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX === null && event.clientX !== null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }
        data = {
            x: event.pageX,
            y: event.pageY
        };
         var d = new Date();
        intellipay.storage.move.push({date: d, data: data}); 
        console.log(intellipay.storage);
        intellipay.time = new Date();
    },
    keyListener : function(e){
      var code = null;
      var el = null;
      
      if(window.event){
          el = window.event.srcElement;
          code = e.which;
      }else{
          el =  e.target;
          code = e.keyCode;
      } 
        data = {
            tagName: el.tagName,
            name: el['name'],
            id: el['id'],
            value: String.fromCharCode(code),
            code: code
        };

        var d = new Date();
        intellipay.storage.click.push({date: d, data: data}); 
        console.log(intellipay.storage);
     
    },
    clickListener : function(e){
        var clickedElement = null, x= null, y = null;
        
        if(window.event){
            clickedElement = window.event.srcElement;
            x = window.event.clientX;
            y = window.event.clientX;
        }else{
            clickedElement = e.target;
            x = e.clientX;
            y = e.clientY;
        }
        
        data = {
            tagName: clickedElement.tagName,
            name: clickedElement['name'],
            id: clickedElement['id'],
            pos: {x: x, y: y}
        };
        var d = new Date();
        intellipay.storage.click.push({date: d, data: data}); 
        console.log(intellipay.storage);
    },
    storage: {
        click: [],
        move: []
    }
};