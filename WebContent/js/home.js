var documentName = "Name of the document";
var documentId = "documentid"; 
var jsonUrl = "1.json";
var active="card-";
document.title = "Title of document";

var navigate = function (panel, direction) {
            var layout = panel.getLayout();
            layout[direction]();
            Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
            Ext.getCmp('move-next').setDisabled(!layout.getNext());
            if(layout.activeItem.id==active)
            	Ext.getCmp('finish').setDisabled(false);
            else
            	Ext.getCmp('finish').setDisabled(true);
        }; 

var formPn = new Ext.form.Panel({
            bodyStyle: 'padding: 10px',
            layout: 'card',
            title: documentName,
            autoHeight: true,
            url : 'StorageService',
            frame:true,
            width:500,
            autoWidth: true,
            labelAlign: 'right',
            bbar: [{
                id: 'move-prev',
                text: 'Back',
                handler: function (btn) {
                    navigate(btn.up("panel"), "prev");
                },
                disabled: true
            }, '->', // greedy spacer so that the buttons are aligned to each side
            {
                id: 'finish',
                text: 'Finish',
                handler: function () {
                	 var form = this.up('form').getForm();
                	 if (form.isValid()) {
                         form.submit(
                         {
                        	 	success: function(form, action) {
       
                             },
                             failure: function(form, action) {
                                 Ext.Msg.alert('Failed', action.result.msg);
                             }
                         });
                     }
                    
                }
            ,
            disabled: true
            },
            {
                id: 'move-next',
                text: 'Next',
                handler: function (btn) {
                    navigate(btn.up("panel"), "next");
                }
            }],
            defaultType: "textfield"
            });
            
            
 var jsonPn = new Ext.form.Panel({
            bodyStyle: 'padding: 10px',
            layout:'card',
            title: "JSON editor",
           // autoHeight: true,
            url : 'convert',
            frame:true,
            width:500,
            autoWidth: true,
            labelAlign: 'right',
            items: [
			{
            xtype:'textareafield',
            name: 'file',
            allowBlank:false
        }],
        bbar:[
        {
				text : 'Update',
				margin : '10 0 0 0',
					handler : function() {
						 var form = this.up('form').getForm();
                	 if (form.isValid()) {
                         form.submit(
                         {
                        	 	success: function(response, opts) {
							       		formPn.removeAll();
								
							       		var obj;
							       		obj = Ext.decode(opts.response.responseText);
									       var data = obj.data;
									       var length = obj.data.length;
									       active = active + (length-1);
									       for(var iter=0;iter<length;iter++)
									    	   {
									    	   var datef =Ext.ComponentManager.create(data[iter]);
									    	  formPn.add(datef);
									    	   }
									      // formPn.render('form-right');
                             },
                             failure: function(form, action) {
                                 Ext.Msg.alert('Failed', action.result.msg);
                             }
                         });
					}
			}}]
            });
            
 
 
Ext.onReady(function() {
    var panel = Ext.create('Ext.Panel', {
        id:'main-panel',
        baseCls:'x-plain',
        renderTo: Ext.getBody(),
        layout: {
            type: 'table',
            columns: 2
        },
        // applied to child components
        defaults: {frame:true, width:600, height: 550},
        items:[jsonPn,formPn]
    });
});
