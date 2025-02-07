sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v4/ODataModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Input",
    "sap/m/Button"
], function(Controller, ODataModel, MessageBox, Dialog, Input, Button) {
    "use strict";

    return Controller.extend("myapp.controller.UserList", {
        onInit: function() {
            // OData V4 model oluştur
            var oModel = new ODataModel({
                serviceUrl: "/user-service/",
                synchronizationMode: "None",
                groupProperties: {
                    default: { submit: 'Auto' }
                }
            });
            
            this.getView().setModel(oModel);
        },

        onAddUser: function() {
            var that = this;
            if (!this.addDialog) {
                this.addDialog = new Dialog({
                    title: "Add New User",
                    content: new Input({
                        placeholder: "Type user name"
                    }),
                    beginButton: new Button({
                        text: "Add",
                        press: function() {
                            var userName = this.addDialog.getContent()[0].getValue();
                            if (userName) {
                                // OData V4 create
                                var oContext = this.getView().getModel().createEntry("/Users", {
                                    properties: {
                                        name: userName
                                    }
                                });
                                
                                oContext.created().then(function() {
                                    MessageBox.success("User added successfully");
                                    that.addDialog.close();
                                }).catch(function(oError) {
                                    MessageBox.error("Error creating user: " + oError.message);
                                });
                            }
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function() {
                            this.addDialog.close();
                        }.bind(this)
                    })
                });
            }
            this.addDialog.open();
        },

        onRefresh: function() {
            this.getView().getModel().refresh();
        },

        onDelete: function(oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            
            MessageBox.confirm("Are you sure you want to delete this user?", {
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        oContext.delete().then(function() {
                            MessageBox.success("User deleted");
                        }).catch(function(oError) {
                            MessageBox.error("Deletion failed: " + oError.message);
                        });
                    }
                }
            });
        }
    });
});