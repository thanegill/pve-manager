Ext.define('PVE.storage.NexentaInputPanel', {
    extend: 'PVE.panel.InputPanel',

    onGetValues: function(values) {
	var me = this;

	if (me.create) {
	    values.type = 'nexenta';
            values.content = 'images';

	} else {
	    delete values.storage;
	}

	values.disable = values.enable ? 0 : 1;	    
	delete values.enable;

	values.ssl = values.enablessl ? 1 : 0;	    
	delete values.enablessl;

	return values;
    },

    initComponent : function() {
	var me = this;


	me.column1 = [
	    {
		xtype: me.create ? 'textfield' : 'displayfield',
		name: 'storage',
		height: 22, // hack: set same height as text fields
		value: me.storageId || '',
		fieldLabel: 'ID',
		vtype: 'StorageId',
		allowBlank: false
	    },
	    {
		xtype: me.create ? 'textfield' : 'displayfield',
		name: 'portal',
		height: 22, // hack: set same height as text fields
		value: '',
		fieldLabel: gettext('Portal'),
		allowBlank: false
	    },
	    {
		xtype: me.create ? 'textfield' : 'displayfield',
		name: 'target',
		height: 22, // hack: set same height as text fields
		value: 'iqn.1986-03.com.sun:02:....',
		fieldLabel: gettext('Target'),
		allowBlank: false
	    },
	    {
		xtype: me.create ? 'textfield' : 'displayfield',
		name: 'pool',
		height: 22, // hack: set same height as text fields
		value: '',
		fieldLabel: gettext('Pool'),
		allowBlank: false
	    },
	    {
		xtype: me.create ? 'textfield' : 'displayfield',
		name: 'login',
		height: 22, // hack: set same height as text fields
		value: '',
		fieldLabel: gettext('Login'),
		allowBlank: false
	    },
	    {
		xtype: me.create ? 'textfield' : 'displayfield',
		name: 'password',
		height: 22, // hack: set same height as text fields
		value: '',
		fieldLabel: gettext('Password'),
		allowBlank: false
	    }
	];

	me.column2 = [
	    {
		xtype: 'pvecheckbox',
		name: 'enable',
		checked: true,
		uncheckedValue: 0,
		fieldLabel: gettext('Enable')
	    },
	    {
		xtype: 'pvecheckbox',
		name: 'enablessl',
		checked: true,
		uncheckedValue: 0,
		fieldLabel: gettext('ssl')
	    },
	    {
		xtype: me.create ? 'textfield' : 'displayfield',
		name: 'blocksize',
		height: 22, // hack: set same height as text fields
		value: '4K',
		fieldLabel: gettext('Block Size'),
		allowBlank: false
	    }
	];

	if (me.create || me.storageId !== 'local') {
	    me.column2.unshift({
		xtype: 'PVE.form.NodeSelector',
		name: 'nodes',
		fieldLabel: gettext('Nodes'),
		emptyText: gettext('All') + ' (' + 
		    gettext('No restrictions') +')',
		multiSelect: true,
		autoSelect: false
	    });
	}

	me.callParent();
    }
});

Ext.define('PVE.storage.NexentaEdit', {
    extend: 'PVE.window.Edit',

    initComponent : function() {
	var me = this;
 
	me.create = !me.storageId;

	if (me.create) {
            me.url = '/api2/extjs/storage';
            me.method = 'POST';
        } else {
            me.url = '/api2/extjs/storage/' + me.storageId;
            me.method = 'PUT';
        }

	var ipanel = Ext.create('PVE.storage.NexentaInputPanel', {
	    create: me.create,
	    storageId: me.storageId
	});

	Ext.apply(me, {
            subject: PVE.Utils.format_storage_type('nexenta'),
	    isAdd: true,
	    items: [ ipanel ]
	});
	
	me.callParent();

        if (!me.create) {
            me.load({
                success:  function(response, options) {
                    var values = response.result.data;
                    if (values.nodes) {
                        values.nodes = values.nodes.split(',');
                    }
                    values.enable = values.disable ? 0 : 1;
                    values.enablessl = values.ssl ? 1 : 0;
                    ipanel.setValues(values);
                }
            });
        }
    }
});