var intellipay = {
    init: function(options){
        if(window.$ === undefined){
            this.log('No jQuery found');
            return;
        }
        document.onclick = this.clickListener;
        this.addEvent(document, "keydown", this.keyListener);
        document.onmousemove = this.handleMouseMove;
        window.onbeforeunload = this.onUnload;
        this.time = new Date();
        this.saveInterval = setInterval(this.save, 5000);
        this.transactionId = options.transactionId;
        $('.submit').on('click',function(e){
            e.preventDefault();
            intellipay.save();
            intellipay.currentForm = $(this).parents('form:first');
            setTimeout(function(){
                intellipay.currentForm.submit();
            }, 1000);
        });
    },
    currentForm: null,
    onUnload: function(e){
        intellipay.save();
    },
    addEvent: function( obj, type, fn ) {
        if ( obj.attachEvent ) {
            obj['e'+type+fn] = fn;
            obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
            obj.attachEvent( 'on'+type, obj[type+fn] );
        } else
            obj.addEventListener( type, fn, false );
    },
    transactionId: 1,
    log: function(str){
        if(window.console !== undefined){
            console.log(str);
        }
    },
    save : function(){
        var dataObj = JSON.stringify(intellipay.storage);
        intellipay.storage =  {
            click: [],
            move: []
        };
        intellipay.log('saving...');
        $.ajax({
            type: "POST",
            contentType : 'application/json',
            url: 'http://localmondido.com:4000/events',//'https://data.mondido.com/v1/analytics',
            data: dataObj,
            success: function(e){
                intellipay.log(e);
            },
            dataType: 'json'
            });
    },
    time: null,
    handleMouseMove: function(e){
        var dot, eventDoc, doc, body, pageX, pageY, data, event;
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
        intellipay.storage.move.push({transactionId: intellipay.transactionId, timeStamp: d.getTime(), data: data, type:'move'}); 
        intellipay.time = new Date();
    },
    keyListener : function(e){
      var code = null;
      var el = null;
      
      if(window.event){
          el = window.event.target;
          if(!el){
              el = window.event.srcElement;
          }          
          code = e.which;
          if(!code){
              code = e.keyCode;
          }
      }else{
          el =  e.target;
          code = e.keyCode;
      } 
        data = {
            tagName: el.tagName,
            name: intellipay.nullify(el['name']),
            id: intellipay.nullify(el['id']),
            value: String.fromCharCode(code),
            code: code
        };
        var d = new Date();
        intellipay.storage.click.push({transactionId: intellipay.transactionId, timeStamp: d.getTime(), data: data, type: 'click'}); 
     
    },
    clickListener : function(e){
        var clickedElement = null, x= null, y = null;
        
        if(window.event){
            clickedElement = window.event.target;
            if(!clickedElement){
                clickedElement = window.event.srcElement;
            }
            x = window.event.clientX;
            y = window.event.clientX;
        }else{
            clickedElement = e.target;
            x = e.clientX;
            y = e.clientY;
        }
        
        var data = {
            tagName: clickedElement.tagName,
            name: intellipay.nullify(clickedElement['name']),
            id: intellipay.nullify(clickedElement['id']),
            pos: {x: x, y: y}
        };
        var d = new Date();
        intellipay.storage.click.push({transactionId: intellipay.transactionId, timeStamp: d.getTime(), data: data, type:'click'}); 
        intellipay.save();
    },
    nullify: function(obj){
        if(obj){
            return obj;
        }
        return null;
    },
    storage: {
        click: [],
        move: []
    }
};