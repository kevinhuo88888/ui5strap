/*
 * 
 * UI5Strap Core Library
 *
 * pks.ui5strap.ex.library
 * 
 * @author Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Homepage: http://ui5strap.com
 *
 * Copyright (c) 2013-2014 Jan Philipp Knöller <info@pksoftware.de>
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Released under Apache2 license: http://www.apache.org/licenses/LICENSE-2.0.txt
 * 
 */

sap.ui
		.define(
				[ 'jquery.sap.global', 
				  'sap/ui/Device', 
				  'sap/ui/core/library',
				  'jquery.sap.mobile'
				],
				function(
					jQuery, 
					Device, 
					coreLib, 
					jqm
				) {
					
					"use strict";
					
					/*
					 * ---------------
					 * 
					 * Declare Library
					 * 
					 * ---------------
					 */

					/**
					 * The ui5strap library.
					 *
					 * @namespace
					 * @name ui5strap
					 * @author Jan Philipp Knoeller
					 * @version 0.11.6
					 * @public
					 */
					sap.ui.getCore().initLibrary(
							{
								name : "pks.ui5strap.ex",

								version : "0.11.6-SNAPSHOT",

								dependencies : [ "sap.ui.core" ],

								types : [ ],

								interfaces : [],

								controls : [],

								elements : []
							});
					
					var ui5strapExLib = pks.ui5strap.ex;
					
					/*
					 * BarNavContainerMode
					 */
					ui5strapExLib.BarNavContainerMode = {
						Intrude : "Intrude",
						Extrude : "Extrude",
						Overlay : "Overlay"
					};

					/*
					 * BarNavContainerPlacement
					 */
					ui5strapExLib.BarNavContainerPlacement = {
						Left : "Left",
						Top : "Top",
						Right : "Right",
						Bottom : "Bottom"
					};

					/*
					 * BarMenuType
					 */
					ui5strapExLib.BarMenuType = {
						Default : "Default",
						ListHorizontal : "ListHorizontal",
						ListVertical : "ListVertical",
						ButtonsHorizontal : "ButtonsHorizontal",
						ButtonsVertical : "ButtonsVertical"
					};
					
					// End of library
					return ui5strapExLib;

				});