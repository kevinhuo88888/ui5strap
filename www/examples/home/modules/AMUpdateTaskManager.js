/**
 * 
 * Ui5OS
 * 
 * ui5os.modules.AMUpdateTaskManager
 * 
 * Author: Jan Philipp Koeller
 * 
 * Copyright (c) 2013 Philipp Knoeller Software
 * 
 * http://pksoftware.de
 *
 * ALL RIGHTS RESERVED
 * 
 */


sap.ui.define(['pks/ui5strap/bs3/library', 'pks/ui5strap/viewer/Task'], function(library, Task){

	var AMUpdateTaskManager = Task.extend("pks.ui5strap.action.AMUpdateTaskManager"),
	AMUpdateTaskManagerProto = AMUpdateTaskManager.prototype;

	AMUpdateTaskManagerProto.namespace = 'updateTaskManager';

	AMUpdateTaskManagerProto.run = function(){
			jQuery.sap.log.debug('Update Task Manager');
			
			var loadedSapplications = this.context.app.getViewer().getLoadedApps();

			var configs = [];

			for(var appId in loadedSapplications){
				configs.push(loadedSapplications[appId].config.data);
			};
			
			var tm = this.context.controller.getView().byId('taskManager'); 

			tm.setModel(new sap.ui.model.json.JSONModel({ "sapplications" : configs }), 'tasks');

			this.then();
	};
	
	return AMUpdateTaskManager;
});