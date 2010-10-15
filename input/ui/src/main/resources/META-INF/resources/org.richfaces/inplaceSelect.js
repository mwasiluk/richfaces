(function ($, rf) {
	
	rf.ui = rf.ui || {};
    
	rf.ui.InplaceSelect =  function(id, options) {
    	$super.constructor.call(this, id, options)

    	options['attachTo'] = id;
    	options['attachToBody'] = true;
    	this.popupList = new rf.ui.SelectList(options.list, this, options);

    	this.items = options.items;
    	this.selValueInput = $(document.getElementById(options.selValueInput));
		this.openPopup = false; 

    }

	rf.ui.InplaceInput.extend(rf.ui.InplaceSelect);
	$.extend(rf.ui.InplaceSelect, rf.ui.SelectListener);
	
	var $super = rf.ui.InplaceSelect.$super;
	$.extend(rf.ui.InplaceSelect.prototype, ( function () {
		
		return{
			name : "inplaceSelect",
			
			getName: function() {
				return this.name;
			},
			
			geNamespace: function() {
				return this.namespace;
			},

			onshow: function() {
				if(this.openPopup) {
					this.popupList.show();
				}
				
				if(!this.openPopup) {
					this.openPopup = true;
				}
				
				$super.onshow.call(this);
			}, 
			
			onhide: function() {
				this.popupList.hide();
				this.openPopup = false;
			}, 
			
			processItem: function(item) {
				var key = $(item).attr("id");
				var value = this.getItemValue(key);
				this.saveItemValue(value);
				var label = this.getItemLabel(key);
				this.setValue(label);
				
           		this.popupList.hide();
				this.openPopup = false;
           		this.__setInputFocus();
			},
			
			getItemValue: function(key) {
				for(var i in this.items) {
					var item = this.items[i];
					if(item && item.id == key) {
						return item.value;
					}
				}
			}, 
			
			saveItemValue: function(value) {
				this.selValueInput.val(value);
			},
			
			getItemLabel: function(key) {
				for(var i in this.items) {
					var item = this.items[i];
					if(item && item.id == key) {
						return item.label;
					}
				}
			}, 
			
       		__keydownHandler: function(e) {
				
				var code; 
				
				if(e.keyCode) {
					code = e.keyCode;
				} else if(e.which) {
					code = e.which;
				}
       			
				if(this.popupList.isVisible()) {
	       			switch(code) {
	       				case rf.KEYS.DOWN: 
	       					e.preventDefault();
	       					this.popupList.__selectNext(); 
	       	           		this.__setInputFocus();
	       					break;
	       				
	       				case rf.KEYS.UP:
	       					e.preventDefault();
	       					this.popupList.__selectPrev();
	       	           		this.__setInputFocus();
	       					break;
	       				
	       				case rf.KEYS.RETURN:
	       					e.preventDefault();
	       					this.popupList.__selectCurrent();
	       	           		this.__setInputFocus();
	       					return false;
	       					break;
	   				}
				}
       			
				$super.__keydownHandler.call(this,e);

			},
			
			__isButton: function(target) {
				
			},
						
			__blurHandler: function(e) {
				var target = $(e.originalEvent.explicitOriginalTarget);
				if(!this.popupList.isPopupList(target)) {
					$super.__blurHandler.call(this,e);
				} 				
       			return false;
       		}
		}
		
	})());

})(jQuery, window.RichFaces);
